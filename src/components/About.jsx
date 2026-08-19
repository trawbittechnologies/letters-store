'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWandMagicSparkles, faAward, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { useSettingsStore } from '../store/settingsStore';
import { DoodleSparkle, DoodleGiftBox, DoodleWavyUnderline } from './Doodles';

export default function About() {
  const { settings } = useSettingsStore();

  const values = [
    { icon: faHeart, title: 'Emotive Artistry', desc: 'Gifts are tangible expressions of affection, gratitude, and lasting remembrance.' },
    { icon: faWandMagicSparkles, title: 'Artisanal Quality', desc: 'Hand-selected gourmet confections, preserved blooms, and bespoke keepsakes.' },
    { icon: faAward, title: 'Established 2020', desc: 'Half a decade of trusted gifting for weddings, festivals & milestones.' },
    { icon: faShieldHalved, title: 'Personalized Touch', desc: 'Every order comes with handwritten notes, wax seals, and direct WhatsApp care.' },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-t border-[var(--border)]/40 transition-colors duration-200 relative overflow-hidden">

      {/* Doodle accent */}
      <div className="absolute top-10 right-12 text-[var(--chandanam)]/15 pointer-events-none hidden lg:block">
        <DoodleGiftBox className="w-14 h-14" />
      </div>
      <div className="absolute bottom-10 left-10 text-[var(--olive)]/10 pointer-events-none hidden lg:block">
        <DoodleSparkle className="w-8 h-8" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Image */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-sm">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[var(--bg-subtle)] group">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                  alt="LETTERS Gifting Atelier"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-[#182216]/90 backdrop-blur-md border border-[var(--border)]">
                  <p
                    className="text-[var(--text)]"
                    style={{ fontFamily: "'Great Vibes', cursive", fontSize: '20px', letterSpacing: '0.02em' }}
                  >
                    {settings.brandName} Gifting Studio
                  </p>
                  <p className="text-xs text-[var(--text-muted)] italic mt-0.5">"Making your moments unforgettable"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7">
            <span
              className="block mb-2 text-[var(--chandanam)]"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '26px', letterSpacing: '0.02em' }}
            >
              Our Brand Philosophy
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[var(--text)] leading-tight mb-2">
              Thoughtful Gifting,
            </h2>
            <div className="relative inline-block mb-6">
              <span
                className="text-[var(--olive)]"
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(28px, 3vw, 38px)', letterSpacing: '0.02em' }}
              >
                Crafted with Heart & Intention
              </span>
              <DoodleWavyUnderline className="absolute -bottom-1 left-0 w-full h-2.5 text-[var(--chandanam)]/40" />
            </div>

            <p className="text-[var(--text-muted)] text-[14px] leading-[1.8] mb-8 max-w-xl">
              Based in Kerala, LETTERS is a boutique bespoke gifting studio founded with a passion for transforming heartfelt gestures into extraordinary sensorial experiences.
            </p>

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, idx) => (
                <div
                  key={idx}
                  className="flex gap-3.5 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]/60 hover:border-[var(--border)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--olive)] text-xs flex-shrink-0 mt-0.5 shadow-xs">
                    <FontAwesomeIcon icon={v.icon} />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm font-bold text-[var(--text)] mb-0.5">{v.title}</h3>
                    <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
