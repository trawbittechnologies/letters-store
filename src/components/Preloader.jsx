'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Detects whether the browser can render WebM with alpha transparency.
 *
 * Safari (all iOS/iPadOS including Chrome on iOS which uses WebKit) cannot
 * render alpha-transparent WebM — it replaces transparent pixels with black.
 * Chrome on iPad must also be treated as iOS because its underlying renderer
 * is still WebKit (Apple forces this).
 *
 * We use a canvas-based approach for ALL browsers: draw video frames onto
 * a canvas with `clearRect` before each frame. Canvas compositing correctly
 * preserves alpha on every platform, including iPhone and iPad.
 */

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  /* ─── Lock scroll while preloader is visible ─── */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ─── Canvas render loop + timing ─── */
  useEffect(() => {
    const vid    = videoRef.current;
    const canvas = canvasRef.current;
    if (!vid || !canvas) return;

    // Dismiss after the full 9-second animation
    const dismissTimer = setTimeout(() => setLoading(false), 9000);

    function drawFrame() {
      if (!vid || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure canvas matches the natural video dimensions for pixel-perfect alpha
      if (canvas.width !== vid.videoWidth || canvas.height !== vid.videoHeight) {
        canvas.width  = vid.videoWidth  || 540;
        canvas.height = vid.videoHeight || 540;
      }

      // clearRect preserves alpha — no black fill ever
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      rafRef.current = requestAnimationFrame(drawFrame);
    }

    function startPlayback() {
      vid.currentTime = 0;
      vid.play().catch(() => {
        // Autoplay blocked — still show canvas, timer will dismiss
      });
      rafRef.current = requestAnimationFrame(drawFrame);
    }

    if (vid.readyState >= 2) {
      startPlayback();
    } else {
      vid.addEventListener('canplay', startPlayback, { once: true });
    }

    return () => {
      clearTimeout(dismissTimer);
      cancelAnimationFrame(rafRef.current);
      vid.removeEventListener('canplay', startPlayback);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="letters-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none pointer-events-auto"
        >
          {/*
           * The hidden <video> element drives playback.
           * The <canvas> renders each frame — canvas compositing preserves
           * alpha transparency on ALL platforms (Chrome, Safari, iOS, iPadOS).
           * display:none on the video prevents iOS from showing a black box.
           */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            // x-webkit-airplay & disablePictureInPicture prevent fullscreen on iOS
            x-webkit-airplay="deny"
            disablePictureInPicture
            style={{ display: 'none' }}
            // Explicitly no background — safety
          >
            {/* Chrome / Edge / Android / PC: VP9 alpha WebM */}
            <source src="/loading.webm"                    type="video/webm" />
            <source src="/transparent-video (22).webm"     type="video/webm" />
          </video>

          {/*
           * Canvas element:
           * - background: transparent (default for <canvas>)
           * - Each frame is drawn after clearRect so alpha is always correct
           * - width/height set dynamically from video.videoWidth / videoHeight
           */}
          <canvas
            ref={canvasRef}
            style={{
              background: 'transparent',
              display: 'block',
              // Responsive sizing matching previous design
              width:  'min(540px, min(92vw, 82vh))',
              height: 'min(540px, min(92vw, 82vh))',
              objectFit: 'contain',
              pointerEvents: 'none',
              // Critical: prevent iOS from adding a black compositing layer
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
