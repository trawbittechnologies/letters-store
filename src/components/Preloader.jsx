'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Hyper-polished Envelope Preloader.
 * Uses 3D perspective, clip-paths, and spring physics to look "like a video".
 */
export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Allow time for the smooth, multi-stage animation
    const dismissTimer = setTimeout(() => {
      setLoading(false);
    }, 3200);

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
          key="letters-premium-envelope-preloader"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[999999] w-screen h-screen flex flex-col items-center justify-center bg-[#FAF7F0] select-none pointer-events-auto"
          style={{ perspective: "1200px" }}
        >
          {/* Main Envelope Assembly */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.15, filter: "blur(8px)", opacity: 0, transition: { duration: 0.7 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-[280px] h-[180px] drop-shadow-2xl"
          >
            
            {/* The Envelope Inside Back (Deep Shadow) */}
            <div className="absolute inset-0 bg-[#C8BFA9] rounded-sm shadow-[inset_0_15px_25px_rgba(0,0,0,0.15)]"></div>

            {/* The Letter Card (Slides Up) */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -90 }}
              transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[260px] h-[160px] bg-[#FFFCF5] rounded-sm shadow-md border border-[#E8DED0]/50 flex flex-col items-center justify-center z-10"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.03\'/%3E%3C/svg%3E")'
              }}
            >
              <div 
                className="text-[48px] font-normal text-[#1A2417] leading-none tracking-tight drop-shadow-sm"
                style={{ fontFamily: "'Alex Brush', 'Pinyon Script', 'Great Vibes', cursive" }}
              >
                Letters
              </div>
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#CD8632] to-transparent mt-2 opacity-60"></div>
              <div className="text-[8px] uppercase tracking-[0.3em] text-[#8A7A66] font-bold mt-2">
                Atelier Handcrafted
              </div>
            </motion.div>

            {/* Left & Right Flaps */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-sm">
              <div 
                className="absolute top-0 left-0 w-[55%] h-full bg-[#E5DCCD] drop-shadow-md"
                style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
              />
              <div 
                className="absolute top-0 right-0 w-[55%] h-full bg-[#E0D6C4] drop-shadow-md"
                style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
              />
            </div>

            {/* Bottom Flap */}
            <div 
              className="absolute bottom-0 left-0 w-full h-[65%] bg-[#EAE1D1] z-30 drop-shadow-xl rounded-b-sm"
              style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
            />

            {/* Top Flap (Rotates Open in 3D) */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: -179.9 }} // Avoid 180 to prevent z-fighting clipping
              transition={{ delay: 0.5, type: "spring", stiffness: 60, damping: 15 }}
              style={{ transformOrigin: "top", transformStyle: "preserve-3d" }}
              className="absolute top-0 left-0 w-full h-[65%] z-40"
            >
              {/* Front of Flap (Visible when closed) */}
              <div 
                className="absolute inset-0 bg-[#E8DED0] drop-shadow-sm rounded-t-sm"
                style={{ 
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              />
              {/* Back of Flap (Visible when open) */}
              <div 
                className="absolute inset-0 bg-[#D3C8B3] rounded-t-sm"
                style={{ 
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  transform: "rotateX(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden"
                }}
              />
            </motion.div>

            {/* Gold Wax Seal (Fades & Scales out right before flap opens) */}
            <motion.div
              initial={{ scale: 1, opacity: 1, rotate: -5 }}
              animate={{ scale: 0.5, opacity: 0, rotate: 10 }}
              transition={{ delay: 0.3, duration: 0.3, ease: "easeIn" }}
              className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full z-50 shadow-md flex items-center justify-center border border-[#E5A04D]/30"
              style={{
                background: "linear-gradient(135deg, #E5A04D 0%, #CD8632 50%, #B07220 100%)",
                boxShadow: "0 4px 6px rgba(176, 114, 32, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)"
              }}
            >
              <div className="w-8 h-8 rounded-full border border-[#721C28]/10 flex items-center justify-center bg-[#CD8632]/20">
                <span className="text-white text-[14px] font-serif italic drop-shadow-sm">L</span>
              </div>
            </motion.div>

          </motion.div>
          
          {/* Subtle loading indicator below the envelope */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-20 flex flex-col items-center gap-3"
          >
             <div className="flex gap-1.5">
               <motion.div 
                 animate={{ opacity: [0.3, 1, 0.3] }} 
                 transition={{ repeat: Infinity, duration: 1.4, delay: 0 }}
                 className="w-1.5 h-1.5 rounded-full bg-[#CD8632]" 
               />
               <motion.div 
                 animate={{ opacity: [0.3, 1, 0.3] }} 
                 transition={{ repeat: Infinity, duration: 1.4, delay: 0.2 }}
                 className="w-1.5 h-1.5 rounded-full bg-[#CD8632]" 
               />
               <motion.div 
                 animate={{ opacity: [0.3, 1, 0.3] }} 
                 transition={{ repeat: Infinity, duration: 1.4, delay: 0.4 }}
                 className="w-1.5 h-1.5 rounded-full bg-[#CD8632]" 
               />
             </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
