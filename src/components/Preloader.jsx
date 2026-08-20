'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Modern, cinematic, and minimalist preloader.
 * Designed to feel luxurious without being over-the-top.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Slightly longer for the cinematic effect to breathe (2.2s)
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 2200);

    return () => {
      document.body.style.overflow = '';
      clearTimeout(dismissTimer);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      document.body.style.overflow = '';
    }
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="letters-modern-preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05, 
            filter: "blur(8px)",
          }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex flex-col items-center justify-center bg-[#FAF7F0] select-none pointer-events-auto"
        >
          {/* Main Content Container */}
          <div className="flex flex-col items-center justify-center gap-6">
            
            {/* Cinematic Fading Text */}
            <motion.div
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <h1 
                className="text-[55px] md:text-[75px] text-[#1A2417] leading-none"
                style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
              >
                Letters
              </h1>
              {/* Subtle Shimmer Overlay */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF7F0]/60 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.div>

            {/* Ultra-Minimalist Expanding Progress Line */}
            <div className="w-24 md:w-32 h-[1px] bg-[#E8DED0] relative overflow-hidden rounded-full">
              <motion.div
                initial={{ scaleX: 0, originX: 0.5 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-gradient-to-r from-[#CD8632] via-[#E5A04D] to-[#CD8632] h-full"
              />
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
