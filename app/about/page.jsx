'use client';

import { Gift, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function AboutPage() {
  const { settings } = useSettingsStore();

  const milestones = [
    { year: '2020', title: 'The Genesis', desc: 'LETTERS was founded in Kerala with a mission to bring personalized, handcrafted elegance to celebratory gifting.' },
    { year: '2022', title: 'Curated Hampers Expansion', desc: 'Introduced luxury wooden and velvet hampers for engagements, weddings, and festive seasons.' },
    { year: '2024', title: 'Everlasting Bouquets', desc: 'Expanded into artistic chocolate bouquets, fresh preserved florals, and spiritual Ajwa gift sets.' },
    { year: '2026', title: 'WhatsApp Atelier', desc: 'Serving thousands of delighted patrons across India with personal concierge ordering and nationwide fulfillment.' },
  ];

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-left max-w-3xl mb-16 pb-6 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--card)] border border-[var(--border-dark)] text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--text)] mb-3">
            <Gift size={11} />
            Heritage & Story
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] leading-tight tracking-tight mb-3">
            Making Moments Memorable Since {settings.establishedYear}
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
            Welcome to {settings.brandName} — an artisan gifting atelier dedicated to the craft of connection, thoughtfulness, and lifelong memories.
          </p>
        </div>

        {/* Hero Visual Section - Square */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight">
              A Gift is More Than an Object. <br />
              <span className="italic font-normal text-[var(--accent-secondary)]">It is a Letter Written to the Heart.</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              When we started {settings.brandName} in {settings.establishedYear}, we noticed that commercial gifting had become impersonal. We wanted to restore the genuine joy of giving — where every ribbon is hand-tied, every chocolate is selected with care, and every note expresses real love.
            </p>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Today, {settings.brandName} creates signature hampers for engagements, weddings, corporate milestones, Islamic holidays, birthdays, and private celebrations across India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/shop" className="gold-btn px-7 py-3.5 text-[10.5px] font-bold uppercase tracking-[0.2em]">
                Browse Collection
              </Link>
              <Link href="/custom-gift" className="outline-btn px-6 py-3.5 text-[10.5px] font-bold uppercase tracking-[0.2em]">
                Design Custom Hamper
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="border border-[var(--border-dark)] bg-[var(--card)] p-2">
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)]">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
                  alt="LETTERS Gifting Atelier"
                  className="w-full h-full object-cover grayscale-[10%]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Journey Timeline - Square Minimal Flat Grid */}
        <div className="bg-[var(--card)] border border-[var(--border-dark)] p-8 sm:p-12 mb-24">
          <div className="text-left mb-10 pb-4 border-b border-[var(--border)]">
            <h3 className="font-heading text-2xl font-bold text-[var(--text)] uppercase tracking-wider mb-1">Our Journey</h3>
            <p className="text-xs text-[var(--text-muted)]">From inception to cherished gifting partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {milestones.map((m, i) => (
              <div key={i} className="p-5 bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
                <div>
                  <span className="font-heading text-2xl font-bold text-[var(--accent-hover)] block mb-1">{m.year}</span>
                  <h4 className="font-heading font-bold text-sm text-[var(--text)] mb-2 uppercase tracking-wider">{m.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gifting Promise */}
        <div className="text-center max-w-2xl mx-auto border border-[var(--border-dark)] bg-[var(--card)] p-10">
          <Sparkles size={20} className="text-[var(--accent)] mx-auto mb-3" />
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3 uppercase tracking-wider">
            Ready to Celebrate Someone Special?
          </h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
            Let us craft a bespoke hamper that expresses your heartfelt wishes with timeless elegance.
          </p>
          <Link
            href="/shop"
            className="gold-btn px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em]"
          >
            Explore Gifts <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>

      </div>
    </div>
  );
}
