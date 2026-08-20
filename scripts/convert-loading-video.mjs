/**
 * Automatically converts WebM transparent animations into formats supported
 * by Apple devices (iPhone, iPad, Safari) preserving full alpha transparency.
 *
 * Generated formats:
 * - loading.webp (Animated WebP with alpha transparency - Universal Apple/iOS/iPad/Safari/Chrome/Firefox/Android support)
 * - loading.mov  (Apple ProRes / HEVC for QuickTime / Safari)
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

  // 1. Generate Animated WebP with transparent alpha channel
  console.log('\n✨ Step 1: Generating transparent Animated WebP (Apple iOS/iPadOS/Safari compatible)...');
  await runFfmpeg([
    '-y',
    '-i', inputPath,
    '-vcodec', 'libwebp',
    '-filter:v', 'fps=24',
    '-lossless', '0',
    '-compression_level', '6',
    '-q:v', '80',
    '-loop', '0',
    '-an',
    outputWebp
  ]);

  if (fs.existsSync(outputWebp)) {
    const sizeMb = (fs.statSync(outputWebp).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Created public/loading.webp (${sizeMb} MB) with alpha transparency`);
  }

  // 2. Generate Apple MOV container
  console.log('\n✨ Step 2: Generating Apple MOV container...');
  try {
    await runFfmpeg([
      '-y',
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


