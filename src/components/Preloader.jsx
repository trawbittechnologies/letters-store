'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Advanced Awwwards-style Preloader.
 * Features a dynamic counter, elegant calligraphy wipe, and a premium split-screen exit transition.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Animate progress 0 -> 100 over 2 seconds
    let startTime = null;
    const duration = 2000;
    
    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const current = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(current);
      
      if (elapsed < duration) {
        requestAnimationFrame(animateProgress);
      }
    };
    requestAnimationFrame(animateProgress);

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
          key="letters-advanced-preloader"
          className="fixed inset-0 z-[999999] w-screen h-screen flex flex-col items-center justify-center select-none pointer-events-auto"
        >
          {/* Top Panel (Slides Up on Exit) */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute top-0 left-0 w-full h-1/2 bg-[#FAF7F0] origin-top"
          />
          
          {/* Bottom Panel (Slides Down on Exit) */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-[#FAF7F0] origin-bottom"
          />

          {/* Central Content Container (Fades Out Slightly Faster than Split) */}
          <motion.div 
            exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)", transition: { duration: 0.4, ease: "easeOut" } }}
            className="relative z-10 flex flex-col items-center justify-center gap-6"
          >
            {/* Elegant Calligraphy Text with Wipe Reveal */}
            <div className="relative">
              {/* Faint Outline / Shadow */}
              <div
                className="text-[65px] md:text-[90px] font-normal text-[#1A2417]/10"
                style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
              >
                Letters
              </div>
              {/* Actual Text wiping in from Left to Right */}
              <motion.div
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 text-[65px] md:text-[90px] font-normal text-[#1A2417] whitespace-nowrap drop-shadow-sm"
                style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
              >
                Letters
              </motion.div>
            </div>

            {/* Advanced Progress Indicator */}
            <div className="flex flex-col items-center gap-3">
              {/* Thin Line */}
              <div className="w-32 h-[1px] bg-[#E8DED0] relative overflow-hidden rounded-full">
                <motion.div
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#CD8632] h-full"
                />
              </div>
              {/* Dynamic Percentage Counter */}
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8A7A66] font-mono">
                {progress.toString().padStart(3, '0')}%
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
