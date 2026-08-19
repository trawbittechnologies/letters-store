'use client';

import { Gift, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSettingsStore } from '../store/settingsStore';

export default function Hero() {
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const handleQuickWhatsAppChat = () => {
    const message = `Hello LETTERS Gifting, I would like to inquire about your bespoke luxury hampers and personalized gifts.`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center bg-[var(--bg)] pt-12 pb-20 border-b border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Tagline Box - Square Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--border-dark)] bg-[var(--card)] mb-6 w-fit select-none">
              <Sparkles size={12} className="text-[var(--accent)]" />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--text)]">
                {settings.tagline} • EST. {settings.establishedYear}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] leading-[1.1] tracking-tight mb-6">
              Making Moments <br />
              <span className="italic font-normal text-[var(--accent-secondary)]">
                Exquisitely Memorable.
              </span>
            </h1>

            {/* Description */}
            <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed max-w-xl font-normal mb-8 border-l-2 border-[var(--accent)] pl-4">
              Thoughtfully curated hampers, bespoke floral arrangements, and personalized keepsakes for life's most precious celebrations. Handcrafted with precision in our studio.
            </p>

            {/* CTAs - Square Geometric Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <Link
                href="/shop"
                className="gold-btn px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase"
              >
                <Gift size={15} className="mr-2" />
                Explore Catalog
              </Link>

              <Link
                href="/custom-gift"
                className="rose-btn px-7 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase"
              >
                <Sparkles size={15} className="mr-2" />
                Custom Hamper
              </Link>

              <button
                onClick={handleQuickWhatsAppChat}
                className="outline-btn px-6 py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase cursor-pointer"
                title="Direct WhatsApp Inquiry"
              >
                <MessageCircle size={15} className="text-[#25D366] mr-2" />
                WhatsApp Desk
              </button>
            </div>

            {/* Trust Badges - Geometric Grid */}
            <div className="grid grid-cols-3 gap-0 border border-[var(--border)] max-w-xl divide-x divide-[var(--border)] bg-[var(--card)]">
              <div className="p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-[var(--accent-hover)] uppercase tracking-widest block mb-1">
                  01 / Craft
                </span>
                <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Artisan Curated</h4>
                <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Since {settings.establishedYear}</p>
              </div>

              <div className="p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-[var(--accent-secondary)] uppercase tracking-widest block mb-1">
                  02 / Logistics
                </span>
                <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Padded Dispatch</h4>
                <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Secure transit</p>
              </div>

              <div className="p-3.5 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                  03 / Care
                </span>
                <h4 className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Direct WhatsApp</h4>
                <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Live photo preview</p>
              </div>
            </div>

          </div>

          {/* Right Column: Square Geometric Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-[var(--border-dark)] bg-[var(--card)] p-2">
              {/* Main Visual Image Box */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)] group">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80"
                  alt="LETTERS Luxury Gifting Showcase"
                  className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-103 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Flat Square Bottom Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-[var(--card)] border border-[var(--border-dark)] flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--accent-secondary)] block">
                      Featured Series
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[var(--text)]">
                      Bespoke Hampers & Bouquets
                    </h3>
                  </div>
                  <Link
                    href="/shop"
                    className="w-8 h-8 bg-[var(--text)] text-[var(--bg)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#111312] transition-colors"
                    aria-label="View shop"
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Square Rating Box Top-Left */}
              <div className="absolute -top-3 -left-3 p-3 bg-[var(--card)] border border-[var(--border-dark)] flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-bold text-xs">
                  5★
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text)]">2,500+ Hampers</p>
                  <p className="text-[8.5px] text-[var(--text-muted)] uppercase tracking-wider">Handcrafted</p>
                </div>
              </div>

              {/* Square Customization Box Bottom-Right */}
              <div className="absolute -bottom-3 -right-3 px-3.5 py-2 bg-[var(--card)] border border-[var(--border-dark)] flex items-center gap-2">
                <Sparkles size={13} className="text-[var(--accent)]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text)]">
                  Name Engraved
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
