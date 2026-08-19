'use client';

import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSettingsStore } from '../store/settingsStore';

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const isAdminRoute = pathname?.startsWith('/admin');
  if (isAdminRoute) {
    return null;
  }

  const handleFloatingClick = () => {
    const message = `Hello ${settings.brandName}, I would like to inquire about placing an order!`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
      <button
        onClick={handleFloatingClick}
        className="w-14 h-14 rounded-full bg-[#1C1C1A] text-[#FFFDF9] dark:bg-[#C9A46C] dark:text-[#161513] backdrop-blur-md shadow-xl border border-[#DDD3C4]/40 dark:border-[#C9A46C]/30 flex items-center justify-center hover:bg-[#C9A46C] hover:text-[#1C1C1A] dark:hover:bg-[#A9824D] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
        aria-label="Direct WhatsApp Concierge"
        title="Chat with our gifting concierge on WhatsApp"
      >
        <MessageCircle size={24} className="stroke-[1.75] group-hover:rotate-6 transition-transform duration-300" />
      </button>
    </div>
  );
}
