'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 2500, suffix: '+', label: 'Hampers Curated' },
  { value: 50, suffix: '+', label: 'Artisanal Gifts' },
  { value: 20, suffix: '+', label: 'Districts Delivered' },
  { value: 100, suffix: '%', label: 'Heartfelt Craft' },
];

function CountUp({ target, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className="py-16 px-6 sm:px-12 border-y border-[var(--border)] bg-[var(--card)] transition-colors duration-300">
      <div ref={ref} className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="flex flex-col items-center"
          >
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--accent-hover)] mb-1.5">
              <CountUp target={s.value} suffix={s.suffix} inView={inView} />
            </p>
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase text-[var(--text-muted)]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
