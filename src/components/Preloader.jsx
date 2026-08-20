'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  // Lock body scroll while preloader is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    }

    // Play for the exact full 9 seconds duration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="letters-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex items-center justify-center bg-[#FAF7F0] select-none pointer-events-auto"
        >
          {/* Centered Large Transparent Video Only */}
          <div className="relative w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] max-w-[92vw] max-h-[82vh] flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-contain pointer-events-none"
            >
              <source src="/loading.webm" type="video/webm" />
              <source src="/transparent-video (22).webm" type="video/webm" />
            </video>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
