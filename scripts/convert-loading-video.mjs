import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('FFmpeg binary path:', ffmpegPath);

const inputPath = join(__dirname, '../public/loading.webm');
const outputPathMov = join(__dirname, '../public/loading.mov');
const outputPathMp4 = join(__dirname, '../public/loading.mp4');

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    console.log('Running FFmpeg with args:', args.join(' '));
    const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg process exited with code ${code}`));
    });
    proc.on('error', reject);
  });
}

async function main() {
  console.log('--- Converting to HEVC with Alpha (.mp4 / .mov) for Apple / Safari / iOS / iPadOS ---');

  // Convert to MOV with HEVC (hvc1) & yuva420p alpha
  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-c:v', 'libx265',
    '-pix_fmt', 'yuva420p',
    '-tag:v', 'hvc1',
    '-movflags', '+faststart',
    '-an',
    outputPathMov
  ]);

  if (fs.existsSync(outputPathMov)) {
    console.log('✅ Created public/loading.mov (' + fs.statSync(outputPathMov).size + ' bytes)');
  }

  // Convert to MP4 with HEVC (hvc1) & yuva420p alpha
  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-c:v', 'libx265',
    '-pix_fmt', 'yuva420p',
    '-tag:v', 'hvc1',
    '-movflags', '+faststart',
    '-an',
    outputPathMp4
  ]);

  if (fs.existsSync(outputPathMp4)) {
    console.log('✅ Created public/loading.mp4 (' + fs.statSync(outputPathMp4).size + ' bytes)');
  }
}

main().catch((err) => {
  console.error('❌ Conversion error:', err);
  process.exit(1);
});

