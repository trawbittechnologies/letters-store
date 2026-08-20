'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Lottie-Powered Preloader
 * 
 * Uses Airbnb's lottie-web engine to render high-performance, crisp vector & frame animation
 * from `/hupng-mp4-to-lottie-1787214446255.json` with 100% native transparency across all devices (iOS/Safari/Android/Desktop).
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    // Lock scroll while preloader is active
    document.body.style.overflow = 'hidden';

    let anim = null;
    let isMounted = true;

    // Dynamically load lottie-web on client
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
          clearCanvas: true,
          progressiveLoad: true,
          hideOnTransparent: true,
        },
      });

      animationRef.current = anim;

      anim.addEventListener('DOMLoaded', () => {
        if (isMounted) setIsLoaded(true);
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

    // Safety fallback timeout in case animation fails or finishes
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 10500);

    return () => {
      isMounted = false;
      document.body.style.overflow = '';
      clearTimeout(safetyTimeout);
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
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none pointer-events-auto"
        >
          <div className="relative flex items-center justify-center w-[min(580px,min(92vw,82vh))] h-[min(580px,min(92vw,82vh))]">
            <div
              ref={containerRef}
              className={`w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
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
