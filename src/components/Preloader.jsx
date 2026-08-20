'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Simple, elegant typography-based preloader.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Simple 2-second loading screen
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

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
          key="letters-simple-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: '#FAF7F0' }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex flex-col items-center justify-center select-none pointer-events-auto"
        >
          <div className="relative">
            {/* Faint background text */}
            <div
              className="text-[60px] md:text-[80px] font-normal text-[var(--text-muted)] opacity-20"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
            >
              Letters
            </div>
            {/* Writing animation layer */}
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 text-[60px] md:text-[80px] font-normal text-[var(--text)] whitespace-nowrap"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
            >
              Letters
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
