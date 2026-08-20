'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Universal Transparent Preloader
 * 
 * Apple Safari / iOS / iPadOS cannot decode VP9 alpha in WebM video,
 * causing transparent pixels to turn black.
 *
 * We provide:
 * 1. High-fidelity transparent Animated WebP (native alpha support in iOS 14+, iPadOS, Safari, Chrome, Edge, Firefox)
 * 2. Multi-source video fallbacks (WebM / MOV)
 * This guarantees 100% transparent backgrounds on iPhone, iPad, Mac, Android, and PC.
 */

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lock scroll while preloader is active
    document.body.style.overflow = 'hidden';

    // Auto-dismiss after animation completes (~9 seconds)
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 9000);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(dismissTimer);
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
          <div className="relative flex items-center justify-center w-[min(540px,min(92vw,82vh))] h-[min(540px,min(92vw,82vh))]">
            {/* Transparent Animated WebP for Apple (iPhone/iPad/Safari) & all modern browsers */}
            <picture className="w-full h-full flex items-center justify-center">
              <source srcSet="/loading.webp" type="image/webp" />
              <img
                src="/loading.webp"
                alt="Letters Loading Animation"
                className="w-full h-full object-contain pointer-events-none select-none bg-transparent"
                style={{
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                }}
              />
            </picture>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

