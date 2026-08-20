/**
 * Automatically converts WebM transparent animations into formats supported
 * across all devices, specifically optimized for Apple (iPhone, iPad, Safari).
 *
 * Generated formats:
 * 1. loading.webp         - Lightweight 540px 20fps Animated WebP (Full Alpha)
 * 2. loading-stacked.mp4  - Hardware-accelerated Stacked RGB+Alpha H.264 MP4 (Apple/Universal WebGL/Canvas)
 * 3. loading.mov          - Apple ProRes 4444 with Alpha
 *
 * Run with: npm run convert:video OR node scripts/convert-loading-video.mjs
 */

import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../public/loading.webm');
const outputWebp = join(__dirname, '../public/loading.webp');
const outputStackedMp4 = join(__dirname, '../public/loading-stacked.mp4');
const outputMov = join(__dirname, '../public/loading.mov');

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
    proc.on('error', reject);
  });
}

async function main() {
  console.log('🎬 Converting WebM transparent animation for Apple (iPhone/iPad/Safari) & Universal devices...');

  if (!fs.existsSync(inputPath)) {
    console.error('❌ Input file not found:', inputPath);
    process.exit(1);
  }

  // 1. Generate Lightweight Optimized Animated WebP (<800KB, perfect for fast mobile decoding on iPad/iPhone)
  console.log('\n✨ Step 1: Generating optimized transparent Animated WebP...');
  await runFfmpeg([
    '-y',
    '-c:v', 'libvpx-vp9',
    '-i', inputPath,
    '-vf', 'scale=540:-1:flags=lanczos,fps=20',
    '-vcodec', 'libwebp',
    '-lossless', '0',
    '-compression_level', '6',
    '-q:v', '75',
    '-loop', '0',
    '-an',
    outputWebp
  ]);

  if (fs.existsSync(outputWebp)) {
    const sizeKb = (fs.statSync(outputWebp).size / 1024).toFixed(0);
    console.log(`✅ Created public/loading.webp (${sizeKb} KB)`);
  }

  // 2. Generate Stacked RGB + Alpha MP4 (Standard H.264, 100% hardware accelerated on Apple iOS/iPadOS/Safari)
  console.log('\n✨ Step 2: Generating Stacked RGB+Alpha MP4...');
  await runFfmpeg([
    '-y',
    '-c:v', 'libvpx-vp9',
    '-i', inputPath,
    '-filter_complex', '[0:v]split=2[color][alpha_in];[alpha_in]alphaextract[alpha];[color][alpha]vstack[v]',
    '-map', '[v]',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'high',
    '-crf', '20',
    '-movflags', '+faststart',
    '-an',
    outputStackedMp4
  ]);

  if (fs.existsSync(outputStackedMp4)) {
    const sizeMb = (fs.statSync(outputStackedMp4).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Created public/loading-stacked.mp4 (${sizeMb} MB)`);
  }

  // 3. Generate Apple MOV container
  console.log('\n✨ Step 3: Generating Apple MOV container...');
  try {
    await runFfmpeg([
      '-y',
      '-c:v', 'libvpx-vp9',
      '-i', inputPath,
      '-c:v', 'prores_ks',
      '-pix_fmt', 'yuva444p10le',
      '-profile:v', '4444',
      '-an',
      outputMov
    ]);
    if (fs.existsSync(outputMov)) {
      const sizeMb = (fs.statSync(outputMov).size / (1024 * 1024)).toFixed(2);
      console.log(`✅ Created public/loading.mov (${sizeMb} MB)`);
    }
  } catch (e) {
    console.warn('⚠️ ProRes MOV step skipped/failed:', e.message);
  }

  console.log('\n🎉 All Apple-compatible transparent animation formats generated successfully!');
}

main().catch((err) => {
  console.error('❌ Error during conversion:', err);
  process.exit(1);
});



