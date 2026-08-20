'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isAppleSafari, setIsAppleSafari] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Detect Apple iOS & Safari (which lack WebM Alpha transparency support)
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
      setIsAppleSafari(isIOS || isSafari);
    }
  }, []);

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
          {isAppleSafari ? (
            /* Apple Safari / iOS Clean Animated Emblem (prevents WebM black box bug) */
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
              transition={{
                scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.6 },
              }}
              className="relative w-48 h-48 sm:w-64 sm:h-64 flex flex-col items-center justify-center"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-[#FAF7F0] p-4 flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)]">
                <img
                  src="/logo.png"
                  alt="Letters"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          ) : (
            /* Non-Apple / Chromium Video with Full Alpha Transparency */
            <div className="relative w-[320px] h-[320px] sm:w-[460px] sm:h-[460px] md:w-[540px] md:h-[540px] max-w-[92vw] max-h-[82vh] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-contain pointer-events-none"
              >
                <source src="/loading.mov" type='video/mp4; codecs="hvc1"' />
                <source src="/loading.webm" type="video/webm" />
                <source src="/transparent-video (22).webm" type="video/webm" />
              </video>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
