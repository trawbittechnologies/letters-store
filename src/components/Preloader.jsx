'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Ultra-Fast Lottie Preloader
 *
 * Uses lottie-web's hardware-accelerated Canvas engine to stream and render
 * the optimized 3.4MB transparent animation instantly with zero delay.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);
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
        renderer: 'canvas',
        loop: false,
        autoplay: true,
        path: '/hupng-mp4-to-lottie-1787214446255.json',
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
          clearCanvas: true,
          progressiveLoad: true,
        },
      });

      animationRef.current = anim;

      // Auto dismiss when the animation finishes playing
      anim.addEventListener('complete', () => {
        if (isMounted) {
          setTimeout(() => {
            setLoading(false);
          }, 200);
        }
      });
    });

    // Fallback timer (~10s max) so user is never permanently blocked
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 10200);

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
          key="letters-lottie-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none pointer-events-auto"
        >
          <div className="relative flex items-center justify-center w-[min(560px,min(90vw,80vh))] h-[min(560px,min(90vw,80vh))]">
            <div
              ref={containerRef}
              className="w-full h-full object-contain pointer-events-none"
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
