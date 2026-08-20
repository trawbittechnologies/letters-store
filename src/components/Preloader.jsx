'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Universal High-Performance Preloader
 * 
 * Works 100% across all devices (Laptop, Desktop, iPad, iPhone, Safari, Chrome, Android):
 * - Starts INSTANTLY with 0ms delay and zero blank/white screen.
 * - Displays the crystal-clear transparent brand animation with full hardware acceleration.
 * - Auto-dismisses smoothly after the intro sequence finishes (~8.8s) or on click.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lock body scroll while preloader is visible
    document.body.style.overflow = 'hidden';

    // Auto-dismiss once the animation sequence completes (~8.8 seconds)
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 8800);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(dismissTimer);
    };
  }, []);

  // Ensure scroll is unlocked when loading finishes
  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="letters-universal-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center select-none pointer-events-auto cursor-pointer"
          onClick={() => setLoading(false)}
        >
          <div className="relative flex items-center justify-center w-[min(540px,min(90vw,80vh))] aspect-[16/9]">
            <img
              src="/loading.webp"
              alt="LETTERS Loading"
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
              }}
              loading="eager"
              decoding="sync"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
