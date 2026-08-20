import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import ffmpegPath from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webmPath = path.join(__dirname, '../public/loading.webm');
const outputJsonPath = path.join(__dirname, '../public/hupng-mp4-to-lottie-1787214446255.json');
const framesDir = path.join(__dirname, '../scratch_frames');

async function main() {
  console.log('⚡ Building ultra-optimized lightweight Lottie JSON (~1.8 MB)...');

  if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir, { recursive: true });
  }

  // Clear existing frames
  fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));

  // Extract at 480px width, 24fps with high efficiency WebP compression
  const res = spawnSync(ffmpegPath, [
    '-y',
    '-c:v', 'libvpx-vp9',
    '-i', webmPath,
    '-vf', 'scale=480:-1',
    '-vcodec', 'libwebp',
    '-q:v', '60',
    '-compression_level', '4',
    path.join(framesDir, 'frame_%04d.webp')
  ], { stdio: 'inherit' });

  const frameFiles = fs.readdirSync(framesDir).filter(f => f.endsWith('.webp')).sort();
  console.log(`Found ${frameFiles.length} frames.`);

  const fps = 24;
  const width = 480;
  const height = 270;
  const totalFrames = frameFiles.length;

  const assets = [];
  const layers = [];

  frameFiles.forEach((file, index) => {
    const filePath = path.join(framesDir, file);
    const base64 = fs.readFileSync(filePath).toString('base64');
    const assetId = `img_${index}`;

    assets.push({
      id: assetId,
      w: width,
      h: height,
      u: '',
      p: `data:image/webp;base64,${base64}`,
      e: 1,
    });

    layers.push({
      ddd: 0,
      ind: index + 1,
      ty: 2,
      nm: file,
      refId: assetId,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [width / 2, height / 2, 0], ix: 2 },
        a: { a: 0, k: [width / 2, height / 2, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      ip: index,
      op: index + 1,
      st: index,
      bm: 0
    });
  });

  const lottieData = {
    v: '5.7.4',
    fr: fps,
    ip: 0,
    op: totalFrames,
    w: width,
    h: height,
    nm: 'Letters Loading Animation',
    ddd: 0,
    assets: assets,
    layers: layers
  };

  const jsonString = JSON.stringify(lottieData);
  fs.writeFileSync(outputJsonPath, jsonString, 'utf8');

  const sizeMb = (Buffer.byteLength(jsonString) / (1024 * 1024)).toFixed(2);
  console.log(`✅ Success! Generated ${outputJsonPath} (${sizeMb} MB)`);

  // Clean scratch_frames
  fs.readdirSync(framesDir).forEach(f => fs.unlinkSync(path.join(framesDir, f)));
  fs.rmdirSync(framesDir);
}

main().catch(console.error);
