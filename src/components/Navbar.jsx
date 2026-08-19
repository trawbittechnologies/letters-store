'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sun,
  Moon,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Gift,
  MessageCircle,
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useCategoryStore } from '../store/categoryStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { theme, toggleTheme } = useThemeStore();
  const { settings, getWhatsAppUrl } = useSettingsStore();
  const { categories } = useCategoryStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCollectionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  if (isAdminRoute) {
    return null;
  }

  const handleWhatsAppQuickInquiry = () => {
    const message = `Hello ${settings.brandName || 'LETTERS'}, I would like to inquire about your bespoke gift hampers!`;
    window.open(getWhatsAppUrl(message), '_blank');
  };

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Custom Hamper', href: '/custom-gift', badge: 'Bespoke' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* Top Editorial Announcement Strip - Soft Cream Light Aesthetic */}
      <div className="bg-[#EFE7DA] text-[#1C1C1A] text-[11px] py-2 px-4 sm:px-8 tracking-[0.2em] uppercase font-medium flex items-center justify-between border-b border-[#DDD3C4] select-none relative z-50 transition-colors">
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#A9824D] font-semibold">
          <Sparkles size={12} className="text-[#C9A46C]" />
          <span>Atelier Handcrafted</span>
        </div>

        <div className="flex-1 text-center truncate px-2 sm:px-4">
          <span className="text-[#1C1C1A] font-medium tracking-[0.22em]">
            {settings.announcementText || 'Complimentary Handwritten Keepsake Note on All Orders'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] text-[#766F65]">
          <span>Est. {settings.establishedYear || '2020'}</span>
          <span className="opacity-40">•</span>
          <button
            onClick={handleWhatsAppQuickInquiry}
            className="hover:text-[#A9824D] transition-colors flex items-center gap-1.5 cursor-pointer font-semibold text-[#1C1C1A]"
          >
            <MessageCircle size={12} className="text-[#71806C]" />
            <span>WhatsApp Care</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Light Theme Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#DDD3C4] shadow-[0_4px_20px_-4px_rgba(28,28,26,0.05)]'
            : 'bg-[#F8F4EC]/90 backdrop-blur-sm border-b border-[#DDD3C4]/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 sm:h-[86px] flex items-center justify-between">
          
          {/* Brand Identity / Logo */}
          <Link href="/" className="flex items-center gap-3 group py-1 select-none">
            <div className="w-10 h-10 rounded-full bg-[#EFE7DA] border border-[#DDD3C4] flex items-center justify-center text-[#C9A46C] group-hover:bg-[#C9A46C] group-hover:text-[#FFFDF9] transition-all duration-300 shadow-xs">
              <Gift size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl lg:text-[25px] font-bold tracking-[0.22em] text-[#1C1C1A] uppercase leading-none transition-opacity group-hover:opacity-80">
                {settings.brandName || 'LETTERS'}
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.38em] text-[#766F65] font-medium mt-1">
                Luxury Atelier • Est. {settings.establishedYear || '2020'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Main Navigation">
            {/* Collections Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                onMouseEnter={() => setCollectionsOpen(true)}
                className={`flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em] font-medium transition-colors py-2 cursor-pointer ${
                  collectionsOpen || pathname.startsWith('/category')
                    ? 'text-[#A9824D] font-semibold'
                    : 'text-[#766F65] hover:text-[#1C1C1A]'
                }`}
                aria-expanded={collectionsOpen}
              >
                <span>Collections</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${collectionsOpen ? 'rotate-180 text-[#C9A46C]' : 'opacity-60'}`}
                />
              </button>

              {/* Collections Mega Menu Dropdown */}
              <AnimatePresence>
                {collectionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    onMouseLeave={() => setCollectionsOpen(false)}
                    className="absolute top-[calc(100%+4px)] left-1/2 -translate-x-1/2 w-[480px] p-5 rounded-2xl bg-[#FFFDF9] border border-[#DDD3C4] shadow-xl z-50"
                  >
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DDD3C4]/70">
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A9824D]">
                        Curated Collections
                      </span>
                      <Link
                        href="/shop"
                        onClick={() => setCollectionsOpen(false)}
                        className="text-[10.5px] font-medium text-[#766F65] hover:text-[#1C1C1A] transition-colors flex items-center gap-1"
                      >
                        <span>View All</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {categories
                        .filter((c) => c.enabled)
                        .slice(0, 6)
                        .map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setCollectionsOpen(false)}
                            className="p-2.5 rounded-xl hover:bg-[#EFE7DA]/70 border border-transparent hover:border-[#DDD3C4] transition-all flex items-center gap-3 group"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#EFE7DA] flex-shrink-0 border border-[#DDD3C4]/70">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-[#1C1C1A] truncate group-hover:text-[#A9824D] transition-colors">
                                {cat.name}
                              </span>
                              <span className="text-[10px] text-[#766F65] truncate">
                                {cat.group || 'Atelier Series'}
                              </span>
                            </div>
                          </Link>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#DDD3C4]/70 flex items-center justify-between bg-[#EFE7DA]/40 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-[#C9A46C]" />
                        <span className="text-xs font-medium text-[#1C1C1A]">Need a Custom Creation?</span>
                      </div>
                      <Link
                        href="/custom-gift"
                        onClick={() => setCollectionsOpen(false)}
                        className="text-[11px] font-bold text-[#A9824D] hover:underline flex items-center gap-1"
                      >
                        <span>Build Hamper</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Standard Nav Items */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[12px] uppercase tracking-[0.2em] font-medium transition-colors relative py-2 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#1C1C1A] font-semibold'
                      : 'text-[#766F65] hover:text-[#1C1C1A]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-[#C9A46C]/15 text-[#A9824D] border border-[#C9A46C]/30">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavLine"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A46C] rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Direct WhatsApp Concierge Button (Desktop) */}
            <button
              onClick={handleWhatsAppQuickInquiry}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium tracking-wide bg-[#EFE7DA] text-[#1C1C1A] border border-[#DDD3C4] hover:border-[#C9A46C] hover:text-[#A9824D] transition-all cursor-pointer shadow-xs active:scale-95"
              title="Chat directly on WhatsApp"
            >
              <MessageCircle size={14} className="text-[#71806C]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">Concierge</span>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#766F65] hover:text-[#1C1C1A] bg-[#EFE7DA]/70 hover:bg-[#EFE7DA] border border-[#DDD3C4] active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
              aria-label="Toggle theme mode"
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <Sun size={17} strokeWidth={1.8} className="text-[#C9A46C]" />
              ) : (
                <Moon size={17} strokeWidth={1.8} />
              )}
            </button>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1A] bg-[#EFE7DA]/70 hover:bg-[#EFE7DA] border border-[#DDD3C4] active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
              aria-label={`Shopping bag with ${itemCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-[#C9A46C] text-[#1C1C1A] font-bold rounded-full text-[9px] flex items-center justify-center shadow-xs"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1A] bg-[#EFE7DA]/70 hover:bg-[#EFE7DA] border border-[#DDD3C4] active:scale-95 transition-all duration-200 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden bg-[#FFFDF9] border-b border-[#DDD3C4] shadow-xl"
            >
              <div className="px-6 py-8 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                
                {/* Main Navigation Links */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#766F65] font-bold mb-2">
                    Menu
                  </span>
                  
                  <Link
                    href="/shop"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-heading font-medium tracking-wide text-[#1C1C1A] hover:text-[#A9824D] py-2.5 flex items-center justify-between border-b border-[#DDD3C4]/60"
                  >
                    <span>Shop All Gifts</span>
                    <ArrowRight size={16} className="text-[#766F65]" />
                  </Link>

                  <Link
                    href="/custom-gift"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-heading font-medium tracking-wide text-[#1C1C1A] hover:text-[#A9824D] py-2.5 flex items-center justify-between border-b border-[#DDD3C4]/60"
                  >
                    <div className="flex items-center gap-2">
                      <span>Custom Hamper Studio</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C9A46C]/15 text-[#A9824D] border border-[#C9A46C]/30 uppercase tracking-wider">
                        Bespoke
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-[#766F65]" />
                  </Link>

                  <Link
                    href="/about"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-heading font-medium tracking-wide text-[#1C1C1A] hover:text-[#A9824D] py-2.5 flex items-center justify-between border-b border-[#DDD3C4]/60"
                  >
                    <span>Our Story & Craft</span>
                    <ArrowRight size={16} className="text-[#766F65]" />
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-heading font-medium tracking-wide text-[#1C1C1A] hover:text-[#A9824D] py-2.5 flex items-center justify-between border-b border-[#DDD3C4]/60"
                  >
                    <span>Contact & Studio</span>
                    <ArrowRight size={16} className="text-[#766F65]" />
                  </Link>
                </div>

                {/* Popular Categories Grid */}
                {categories && categories.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#766F65] font-bold mb-3 block">
                      Curated Collections
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {categories
                        .filter((c) => c.enabled)
                        .slice(0, 6)
                        .map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="p-3 rounded-xl bg-[#EFE7DA] border border-[#DDD3C4] text-xs font-medium text-[#1C1C1A] hover:bg-[#DDD3C4] transition-colors flex items-center justify-between"
                          >
                            <span className="truncate">{cat.name}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* Direct WhatsApp Ordering Assistance */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleWhatsAppQuickInquiry();
                    }}
                    className="w-full py-3.5 px-4 rounded-full bg-[#71806C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-[#5C6A57] active:scale-95 transition-all"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp Concierge</span>
                  </button>
                </div>

                {/* Footer Brand Info */}
                <div className="pt-4 border-t border-[#DDD3C4] flex items-center justify-between text-[11px] text-[#766F65]">
                  <span>{settings.brandName || 'LETTERS'} Atelier</span>
                  <span>Est. {settings.establishedYear || '2020'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
