'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ShoppingBag, Gift, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useCategoryStore } from '../store/categoryStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const mainNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Gifts', href: '/shop' },
  { label: 'Custom Gift', href: '/custom-gift', highlight: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { settings } = useSettingsStore();
  const { categories } = useCategoryStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const pathname = usePathname();

  const isAdminRoute = pathname?.startsWith('/admin');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      {/* Announcement Top Bar - Square & Minimal */}
      <div className="bg-[var(--text)] text-[var(--bg)] text-[10.5px] py-2 px-4 text-center font-medium tracking-[0.2em] uppercase flex items-center justify-center gap-3 border-b border-[var(--border)] select-none">
        <Sparkles size={11} className="text-[var(--accent)]" />
        <span>{settings.announcementText}</span>
        <span className="hidden md:inline text-[var(--accent)]">/</span>
        <span className="hidden md:inline text-[9.5px] tracking-[0.3em] opacity-80">
          EST. {settings.establishedYear}
        </span>
      </div>

      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled
            ? 'bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--border)]'
            : 'bg-[var(--bg)] border-b border-[var(--border)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo - Square Box Frame */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[var(--card)] border border-[var(--border-dark)] flex items-center justify-center group-hover:border-[var(--accent)] transition-colors">
              <Gift size={18} className="text-[var(--accent)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-[0.2em] text-[var(--text)] uppercase">
                {settings.brandName}
              </span>
              <span className="text-[8px] tracking-[0.35em] text-[var(--text-muted)] uppercase font-bold -mt-0.5">
                Atelier • Est. {settings.establishedYear}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-bold tracking-[0.25em] uppercase transition-colors relative py-1 border-b-2 ${
                  pathname === link.href
                    ? 'border-[var(--accent)] text-[var(--text)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border)]'
                } ${link.highlight ? 'text-[var(--accent-secondary)]' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdown(true)}
              onMouseLeave={() => setCategoryDropdown(false)}
            >
              <button
                className="text-[11px] font-bold tracking-[0.25em] uppercase text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1 py-1 cursor-pointer"
                onClick={() => setCategoryDropdown(!categoryDropdown)}
              >
                Collections
                <ChevronDown size={13} className={`transition-transform duration-150 ${categoryDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {categoryDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full -left-12 w-80 bg-[var(--card)] border border-[var(--border-dark)] p-4 grid grid-cols-1 gap-1 z-50"
                  >
                    <div className="text-[9px] uppercase font-bold tracking-[0.25em] text-[var(--text-muted)] px-3 py-1 border-b border-[var(--border)] mb-2">
                      Gifting Collections
                    </div>
                    {categories.filter(c => c.enabled).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setCategoryDropdown(false)}
                        className="px-3 py-2 text-xs font-medium text-[var(--text)] hover:bg-[var(--bg-subtle)] hover:text-[var(--accent-hover)] transition-colors flex items-center justify-between border-l-2 border-transparent hover:border-[var(--accent)]"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">{cat.group}</span>
                      </Link>
                    ))}
                    <div className="pt-2 mt-2 border-t border-[var(--border)]">
                      <Link
                        href="/shop"
                        onClick={() => setCategoryDropdown(false)}
                        className="text-center block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent-hover)] hover:underline py-1"
                      >
                        View All Collections →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Square Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--text)] hover:border-[var(--text)] transition-colors cursor-pointer"
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Cart Button - Square Frame */}
            <Link
              href="/cart"
              className="gold-btn h-10 px-5 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-[var(--text)] text-[var(--bg)] px-1.5 py-0.5 text-[9px] font-mono font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin Portal Button */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text)] px-2.5 py-2 border border-transparent hover:border-[var(--border)] transition-colors"
              title="Store Admin Panel"
            >
              <Shield size={12} />
              <span>Admin</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden w-10 h-10 border border-[var(--border)] bg-[var(--card)] flex items-center justify-center text-[var(--text)] cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer - Square Flat Design */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-[var(--card)] border-t border-[var(--border-dark)] overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-3">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-xs font-bold tracking-[0.25em] uppercase text-[var(--text)] hover:text-[var(--accent)] py-2 border-b border-[var(--border)]"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-2">
                  <p className="text-[9px] uppercase font-bold tracking-[0.25em] text-[var(--text-muted)] mb-2">
                    Popular Collections
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.filter(c => c.enabled).slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] py-1.5 border-l border-[var(--border)] pl-2"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    <Shield size={13} /> Admin
                  </Link>
                  <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">LETTERS © {settings.establishedYear}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
