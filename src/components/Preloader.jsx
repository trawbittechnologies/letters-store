'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Universal Ultra-Fast Preloader
 * 
 * Instant 0ms Start:
 * 1. Shows instant 1KB poster/first-frame instantly (0ms blank wait on Mobile/iPad/Laptop).
 * 2. Preloads and runs SVG-rendered Lottie animation (`/hupng-mp4-to-lottie-1787214446255.json`).
 * 3. Smoothly fades out and restores scroll once the animation finishes.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [lottieActive, setLottieActive] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Lock scroll while preloader is active
    document.body.style.overflow = 'hidden';

    let anim = null;
    let isMounted = true;

    // Load lottie-web dynamically on client
    import('lottie-web').then((lottieModule) => {
      const lottie = lottieModule.default || lottieModule;
      if (!isMounted || !containerRef.current) return;

      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: '/hupng-mp4-to-lottie-1787214446255.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });

      animationRef.current = anim;

      anim.addEventListener('DOMLoaded', () => {
        if (isMounted) {
          setLottieActive(true);
        }
      });

      // Auto dismiss when the animation completes
      anim.addEventListener('complete', () => {
        if (isMounted) {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }
      });
    });

    // Safety fallback timer (~10s)
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 10000);

    return () => {
      isMounted = false;
      document.body.style.overflow = '';
      clearTimeout(fallbackTimer);
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, []);

  // When loading state ends, ensure body overflow is unlocked
  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="letters-preloader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none pointer-events-auto"
        >
          <div className="relative flex items-center justify-center w-[min(540px,min(90vw,80vh))] aspect-[16/9]">
            {/* Instant First-Frame Poster (0ms start delay across all devices) */}
            <img
              src="/loading-poster.webp"
              alt="LETTERS Loading"
              className={`w-full h-full object-contain pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                lottieActive ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {/* Hardware-Accelerated SVG Lottie Player Container */}
            <div
              ref={containerRef}
              className={`w-full h-full object-contain pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                lottieActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'transparent',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
