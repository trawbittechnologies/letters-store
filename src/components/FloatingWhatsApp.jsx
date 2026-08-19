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
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={handleFloatingClick}
        className="flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 border-2 border-[var(--border-dark)] hover:bg-[#1EBE5D] transition-colors font-bold text-xs tracking-[0.2em] uppercase cursor-pointer"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle size={18} className="fill-current" />
        <span className="hidden sm:inline">WhatsApp Order</span>
      </button>
    </div>
  );
}
