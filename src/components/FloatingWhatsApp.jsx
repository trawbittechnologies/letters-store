'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
        className="w-14 h-14 rounded-full bg-[var(--olive)] text-[#FFFCF5] dark:bg-[var(--accent)] dark:text-[#151B13] backdrop-blur-md shadow-xl border border-[var(--border)]/60 dark:border-[var(--accent)]/30 flex items-center justify-center hover:bg-[var(--accent)] hover:text-[#232D20] dark:hover:bg-[var(--accent-hover)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
        aria-label="Direct WhatsApp Concierge"
        title="Chat with our gifting concierge on WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl group-hover:rotate-6 transition-transform duration-300" />
      </button>
    </div>
  );
}
