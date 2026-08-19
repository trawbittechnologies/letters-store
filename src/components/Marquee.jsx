'use client';

const items = [
  'BESPOKE HAMPERS',
  '/',
  'ARTISANAL FLORAL BOUQUETS',
  '/',
  'ENGAGEMENT CURATIONS',
  '/',
  'BELGIAN CHOCOLATES',
  '/',
  'PERSONALIZED KEEPSAKES',
  '/',
  'HANDCRAFTED IN KERALA',
  '/',
  'WHATSAPP CONCIERGE',
  '/',
  'EST. 2020',
  '/',
];

export default function Marquee() {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-3 border-b border-[var(--border)] bg-[var(--card)] transition-colors duration-200 select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`inline-block px-4 text-[10px] font-bold tracking-[0.25em] uppercase ${
              item === '/' ? 'text-[var(--accent)] font-normal' : 'text-[var(--text)]'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
