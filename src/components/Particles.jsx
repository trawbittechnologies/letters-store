'use client';

import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 22;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Particles() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const el = document.createElement('div');
      const size = randomBetween(2, 5);
      const left = randomBetween(0, 100);
      const delay = randomBetween(0, 12);
      const duration = randomBetween(10, 22);

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        border-radius: 50%;
        background: radial-gradient(circle, #F5D06A, #D4AF37);
        box-shadow: 0 0 ${size * 3}px rgba(212,175,55,0.8);
        opacity: 0;
        animation: particleDrift ${duration}s ${delay}s ease-in infinite;
        pointer-events: none;
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => particles.forEach(p => p.remove());
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
