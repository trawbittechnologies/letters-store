'use client';

import { Sparkles, Gift, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '../store/settingsStore';

export default function CustomGiftCTA() {
  const { settings } = useSettingsStore();

  const benefits = [
    'Handcrafted pinewood, velvet, or wicker packaging',
    'Curate artisan chocolates, florals & fragrances',
    'Personalized name engraving & keepsake note card',
    'Direct WhatsApp photo preview before dispatch',
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-t border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="border border-[var(--border-dark)] bg-[var(--card)] p-8 sm:p-12 lg:p-14">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg)] border border-[var(--border-dark)] text-[9.5px] font-bold tracking-[0.25em] uppercase mb-4 text-[var(--text)]">
                <Sparkles size={11} className="text-[var(--accent)]" />
                Bespoke Atelier Studio
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] leading-tight mb-4">
                Design Your Own <br />
                <span className="italic font-normal text-[var(--accent-secondary)]">
                  Personalized Gift Hamper
                </span>
              </h2>

              <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Have a specific theme, celebration, or recipient in mind? Our bespoke gift specialists handcraft one-of-a-kind curations filled with heartfelt details.
              </p>

              {/* Checklist - Square minimal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2.5 border-l border-[var(--accent)] pl-3 py-1">
                    <Check size={14} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-[var(--text)]">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons - Square */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/custom-gift"
                  className="gold-btn px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  <Gift size={14} className="mr-2" />
                  Open Hamper Studio
                  <ArrowRight size={13} className="ml-2" />
                </Link>

                <Link
                  href="/contact"
                  className="outline-btn px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  Speak with a Curator
                </Link>
              </div>
            </div>

            {/* Right Visual Image - Square */}
            <div className="lg:col-span-5 relative">
              <div className="border border-[var(--border-dark)] bg-[var(--bg)] p-2">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)] group">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                    alt="Custom Gift Box Creation"
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-104 transition-all duration-400"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 text-[9px] font-bold tracking-[0.2em] uppercase bg-[var(--card)] text-[var(--text)] px-3 py-1.5 border border-[var(--border-dark)]">
                    LETTERS EST. {settings.establishedYear} ATELIER
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
