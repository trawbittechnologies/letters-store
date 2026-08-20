'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Meaningful, creative Preloader.
 * Features an envelope that opens, revealing a letter with the brand name.
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Allow time for the envelope to open and the letter to slide out
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 2800);

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
          key="letters-meaningful-preloader"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex flex-col items-center justify-center bg-[#FAF7F0] select-none pointer-events-auto"
        >
          {/* Main Animation Container */}
          <motion.div 
            exit={{ scale: 1.1, filter: "blur(5px)", transition: { duration: 0.6 } }}
            className="relative flex flex-col items-center justify-center w-[300px] h-[300px]"
          >
            
            {/* The Letter (Slides up from inside the envelope) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: -60, opacity: 1 }}
              transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-10 w-[220px] h-[140px] bg-white rounded shadow-sm border border-[#E8DED0] flex flex-col items-center justify-center"
            >
              <div 
                className="text-[40px] font-normal text-[#1A2417] leading-none"
                style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
              >
                Letters
              </div>
              <div className="w-12 h-[1px] bg-[#CD8632]/50 mt-2"></div>
            </motion.div>

            {/* The Envelope Back */}
            <div className="absolute bottom-[60px] z-0 w-[240px] h-[120px] bg-[#E5DCCD] rounded-b"></div>

            {/* The Envelope Flap (Rotates open) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -180 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
              className="absolute top-[60px] z-20 w-0 h-0"
            >
              {/* Flap Triangle */}
              <div 
                className="w-0 h-0"
                style={{
                  borderLeft: "120px solid transparent",
                  borderRight: "120px solid transparent",
                  borderTop: "80px solid #D5C9B3" // Slightly darker than front for depth
                }}
              />
            </motion.div>

            {/* The Envelope Front (Covers the letter body) */}
            <div className="absolute bottom-[60px] z-30 w-[240px] h-[120px] overflow-hidden rounded-b flex items-end">
              {/* Left Triangle */}
              <div 
                className="absolute bottom-0 left-0 w-0 h-0"
                style={{
                  borderBottom: "120px solid #F0E9DC",
                  borderRight: "120px solid transparent"
                }}
              />
              {/* Right Triangle */}
              <div 
                className="absolute bottom-0 right-0 w-0 h-0"
                style={{
                  borderBottom: "120px solid #F0E9DC",
                  borderLeft: "120px solid transparent"
                }}
              />
              {/* Bottom Triangle */}
              <div 
                className="absolute bottom-0 left-0 w-0 h-0"
                style={{
                  borderBottom: "70px solid #EAE1D1",
                  borderLeft: "120px solid transparent",
                  borderRight: "120px solid transparent"
                }}
              />
              {/* Gold Wax Seal (Appears broken/faded or just a decorative seal) */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute bottom-[60px] left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#E5A04D] to-[#CD8632] shadow-sm flex items-center justify-center z-40"
              >
                <span className="text-white text-[10px] font-serif italic">L</span>
              </motion.div>
            </div>

            {/* Meaningful Text below */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="absolute bottom-0 text-[11px] uppercase tracking-[0.3em] font-bold text-[#8A7A66]"
            >
              Curating Memories
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
