'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';

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
          <div className="relative pr-6"> {/* Added padding for the pen icon's movement */}
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
              className="absolute top-0 left-0 text-[60px] md:text-[80px] font-normal text-[var(--text)] whitespace-nowrap"
              style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
            >
              Letters
            </motion.div>
            
            {/* Animated Pen / Quill */}
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
              transition={{ 
                left: { duration: 1.5, ease: "easeInOut" },
                opacity: { duration: 1.8, times: [0, 0.1, 0.8, 1] } 
              }}
              className="absolute top-1/2 -translate-y-1/2 z-10 text-[var(--chandanam)]"
              style={{ 
                originX: 0, originY: 1, // Bottom left origin for writing effect
                filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))'
              }}
            >
              <motion.div
                animate={{ rotate: [0, -15, 5, -10, 0] }}
                transition={{ duration: 1.5, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
              >
                <FontAwesomeIcon icon={faFeatherPointed} className="text-3xl sm:text-4xl -rotate-45" />
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
