'use client';

import { Star, Sparkles, Check } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

const reviews = [
  {
    id: 1,
    name: 'Dr. Zoya K.',
    location: 'Calicut, Kerala',
    occasion: 'Engagement Hamper',
    comment: 'The engagement hamper for my sister was magnificent! The custom engraved keepsake glasses and botanical fragrance stole everyone\'s attention. Thank you LETTERS!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Anand & Reshma',
    location: 'Kochi, Kerala',
    occasion: 'Anniversary Gift',
    comment: 'Ordering through WhatsApp was so effortless. They accommodated all my custom message card requests and delivered right on time.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Nikhil Varghese',
    location: 'Bangalore',
    occasion: 'Chocolate Bouquet',
    comment: 'The Ferrero Rocher bouquet was breathtaking. Far exceeded my expectations in terms of beauty, finish, and ribbon detailing.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { settings } = useSettingsStore();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-[var(--card)] border-t border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-2">
            <Sparkles size={12} className="text-[var(--accent)]" />
            <p className="text-[10px] tracking-[0.3em] text-[var(--accent-secondary)] uppercase font-bold">
              Heartfelt Patron Stories
            </p>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight tracking-tight mb-3">
            Loved Across India
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
            Real stories from patrons who entrusted their celebrations to {settings.brandName} since {settings.establishedYear}.
          </p>
        </div>

        {/* Reviews Grid - Square Flat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-6 sm:p-8 flex flex-col justify-between bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--border-dark)] transition-colors"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 mb-4 text-amber-500">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={13} fill="currentColor" />
                  ))}
                </div>

                <p className="font-heading text-base text-[var(--text)] italic leading-relaxed mb-6">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text)]">{r.name}</h4>
                    <Check size={11} className="text-emerald-500" />
                  </div>
                  <p className="text-[10.5px] text-[var(--text-muted)]">{r.location}</p>
                </div>
                <span className="text-[8.5px] font-bold uppercase tracking-wider border border-[var(--border-dark)] px-2 py-1 bg-[var(--card)] text-[var(--text)]">
                  {r.occasion}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
