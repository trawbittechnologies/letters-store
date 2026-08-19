'use client';

import { Heart, Sparkles, Award, ShieldCheck } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function About() {
  const { settings } = useSettingsStore();

  const values = [
    {
      num: '01',
      icon: Heart,
      title: 'Emotive Artistry',
      desc: 'We believe gifts are tangible expressions of affection, gratitude, and lasting remembrance.',
    },
    {
      num: '02',
      icon: Sparkles,
      title: 'Artisanal Quality',
      desc: 'Hand-selected gourmet confections, fresh preserved blooms, and bespoke keepsakes.',
    },
    {
      num: '03',
      icon: Award,
      title: 'Established 2020',
      desc: 'Over half a decade of trusted gifting experience for weddings, festivals & milestones.',
    },
    {
      num: '04',
      icon: ShieldCheck,
      title: 'Personalized Touch',
      desc: 'Every order is customized with handwritten notes, wax seals, and direct WhatsApp care.',
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-t border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Image Showcase - Square */}
          <div className="lg:col-span-5 relative">
            <div className="border border-[var(--border-dark)] bg-[var(--card)] p-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)] group">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                  alt="LETTERS Gifting Atelier"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-104 transition-all duration-400"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[var(--card)] border border-[var(--border-dark)]">
                  <p className="font-heading text-base font-bold text-[var(--text)] uppercase tracking-wider">{settings.brandName} Gifting</p>
                  <p className="text-xs text-[var(--text-muted)] italic">"Making your special moments a lot more memorable"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] tracking-[0.3em] text-[var(--accent-secondary)] uppercase font-bold">
                  Our Story / EST. {settings.establishedYear}
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight tracking-tight mb-6">
                Thoughtful Gifts Designed to <br />
                <span className="italic font-normal text-[var(--accent-secondary)]">
                  Touch the Heart.
                </span>
              </h2>

              <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed mb-6">
                Founded in <strong>{settings.establishedYear}</strong>, <strong>{settings.brandName}</strong> was born from a simple belief: the most precious gifts are not merely items, but emotional letters of affection. Whether welcoming a new milestone or expressing gratitude, our bespoke hampers turn fleeting occasions into lifelong keepsakes.
              </p>

              <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed mb-8">
                Each collection is curated by hand in our studio with unwavering attention to aesthetic balance, premium ingredients, and refined packaging with direct WhatsApp assistance.
              </p>

              {/* 4 Brand Pillars Grid - Square Flat Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]">
                {values.map((v) => (
                  <div key={v.num} className="p-4 border border-[var(--border)] bg-[var(--card)]">
                    <span className="text-[9px] font-bold text-[var(--accent-hover)] uppercase tracking-[0.2em] block mb-1">
                      {v.num} / {v.title}
                    </span>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1">
                      {v.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
