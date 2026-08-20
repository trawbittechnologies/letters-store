/**
 * Converts the transparent WebM loading animation to HEVC+alpha MOV
 * for iOS/iPadOS/Safari compatibility.
 * 
 * Run with: node scripts/convert-loading-video.mjs
 */

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const ffmpeg = createFFmpeg({ log: true });

async function main() {
  await ffmpeg.load();

  const inputPath = join(__dirname, '../public/loading.webm');
  const inputData = readFileSync(inputPath);

  ffmpeg.FS('writeFile', 'input.webm', inputData);

  // Convert to HEVC with alpha (hvc1 codec) - works on iOS 13+ / Safari 13+
  await ffmpeg.run(
    '-i', 'input.webm',
    '-c:v', 'libx265',
    '-pix_fmt', 'yuva420p',
    '-tag:v', 'hvc1',
    '-movflags', '+faststart',
    '-an',
    'output.mov'
  );

  const outputData = ffmpeg.FS('readFile', 'output.mov');
  const outputPath = join(__dirname, '../public/loading.mov');
  writeFileSync(outputPath, outputData);

  console.log('✅ Created public/loading.mov (HEVC with Alpha) for iOS/Safari');
}

main().catch(err => {
  console.error('❌ Conversion failed:', err.message);
  process.exit(1);
});
