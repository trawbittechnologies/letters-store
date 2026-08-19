'use client';

import { MessageCircle } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';

export default function WhatsAppCTA() {
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const handleStartChat = () => {
    const msg = `Hello ${settings.brandName}, I would like to explore your bespoke gift hampers and bouquet options!`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-t border-[var(--border)] transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="border border-[var(--border)] bg-[var(--card)] rounded-3xl p-8 sm:p-12 lg:p-14 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            
            {/* Left Copy */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-full text-[9px] font-bold tracking-[0.2em] uppercase mb-4 text-[var(--text)]">
                <span className="w-2 h-2 rounded-full bg-[#71806C]" />
                Direct Studio Concierge
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] leading-tight mb-4">
                Have a Custom Gift <br />
                <span className="italic font-normal text-[var(--accent-hover)]">
                  Idea in Mind?
                </span>
              </h2>

              <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
                Connect directly with our gifting curators on WhatsApp. From bespoke wedding favors to personalized anniversary hampers, we respond quickly with catalogs and pricing.
              </p>
            </div>

            {/* Right Action */}
            <div className="flex flex-col items-start sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleStartChat}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full bg-[#71806C] text-white hover:bg-[#5C6A57] transition-all cursor-pointer shadow-md active:scale-95"
              >
                <MessageCircle size={16} className="fill-current" />
                Chat with Us on WhatsApp
              </button>

              <p className="text-xs text-[var(--text-muted)] font-medium text-center">
                Usually responds within 15 mins • {settings.phoneNumber}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
