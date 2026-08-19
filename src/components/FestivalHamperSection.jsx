'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faCheck,
  faBagShopping,
  faGift,
  faSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';
import { useFestivalStore } from '../store/festivalStore';
import { DoodleSparkle, DoodleOliveBranch } from './Doodles';

export default function FestivalHamperSection() {
  const addToCart = useCartStore((state) => state.addToCart);
  const { settings, getWhatsAppUrl } = useSettingsStore();
  const { festivalHampers, isLoaded, fetchFestivalHampers } = useFestivalStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFestivalTab, setActiveFestivalTab] = useState('all');
  const [addedIds, setAddedIds] = useState({});

  useEffect(() => {
    fetchFestivalHampers();
  }, [fetchFestivalHampers]);

  // Active items only
  const activeItems = useMemo(() => {
    return (festivalHampers?.items || []).filter((it) => it.enabled !== false);
  }, [festivalHampers]);

  useEffect(() => {
    if (activeItems.length === 0) return;
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeItems.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, [activeItems.length]);

  const handleNextSlide = () => {
    if (activeItems.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % activeItems.length);
  };

  const handlePrevSlide = () => {
    if (activeItems.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  // If section is disabled or no items are published, hide
  if (isLoaded && (!festivalHampers.enabled || activeItems.length === 0)) {
    return null;
  }

  // Filtered items by selected tab
  const filteredItems = activeFestivalTab === 'all'
    ? activeItems
    : activeItems.filter((it) => it.festivalType === activeFestivalTab);

  const handleAddToCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    const productLike = {
      id: item.id,
      name: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      images: [item.image],
      image: item.image,
      category: 'Festival Hamper',
      slug: item.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
    };
    addToCart(productLike, 1);
    setAddedIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1600);
  };

  const handleWhatsAppOrder = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const msg = `*Festival Hamper Inquiry — LETTERS*\nItem: ${item.title}\nPrice: ₹${item.price} (Original: ₹${item.originalPrice || item.price})\nFestival: ${item.festivalName || item.festivalType}\n\nHello LETTERS team! I would like to order this Festival Hamper. Please guide me with delivery and customization.`;
    window.open(getWhatsAppUrl(msg), '_blank');
  };

  const current = activeItems[currentSlide] || activeItems[0];

  return (
    <section
      id="festival-hampers"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-b border-[var(--border)]/40 relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative Doodles */}
      <div className="absolute top-12 right-12 text-[var(--chandanam)]/10 pointer-events-none hidden lg:block">
        <DoodleOliveBranch className="w-24 h-24" />
      </div>
      <div className="absolute bottom-10 left-8 text-[var(--olive)]/10 pointer-events-none hidden lg:block">
        <DoodleSparkle className="w-10 h-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER */}
        {/* ========================================================================= */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[var(--chandanam)]"
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: '26px', letterSpacing: '0.02em' }}
              >
                {festivalHampers.sectionSubtitle || 'Celebrations of Kerala & Beyond'}
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--text)] leading-tight tracking-tight">
              {festivalHampers.sectionTitle || 'The Festive Hamper Atelier'}
            </h2>
            <p className="text-[var(--text-muted)] text-[13.5px] mt-1 max-w-xl leading-relaxed">
              {festivalHampers.sectionDescription || 'Bespoke seasonal curations crafted to order for Onam, Christmas, Vishu, and Eid & Bakrid.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/category/festival-hamper"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--olive)] hover:text-[var(--olive-hover)] transition-colors group"
            >
              <span>View All Festival Hampers</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[9px] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO FESTIVAL BANNER CAROUSEL (Framer Motion) */}
        {/* ========================================================================= */}
        {current && (
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--card)] border border-[var(--border)] mb-12 shadow-sm group">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45 }}
                className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[420px] lg:min-h-[440px]"
              >
                {/* Content Column */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between h-full relative z-10">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text)] border border-[var(--border)]">
                        {current.badge || current.festivalName || 'Festive Special'}
                      </span>
                      {current.originalPrice && current.originalPrice > current.price && (
                        <span className="text-[10.5px] font-semibold text-[var(--chandanam-dark)]">
                          Save ₹{(current.originalPrice - current.price).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <span
                      className="block mb-1 text-[var(--chandanam)]"
                      style={{ fontFamily: "'Great Vibes', cursive", fontSize: '24px' }}
                    >
                      {current.calligraphy || 'Artisanal Curation'}
                    </span>

                    <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] leading-tight mb-3">
                      {current.title}
                    </h3>

                    <p className="text-[var(--text-muted)] text-xs sm:text-[13.5px] leading-relaxed max-w-lg mb-6">
                      {current.description}
                    </p>

                    <div className="flex items-baseline gap-2.5 mb-8">
                      <span className="font-heading text-2xl font-bold text-[var(--text)]">
                        ₹{current.price?.toLocaleString()}
                      </span>
                      {current.originalPrice && current.originalPrice > current.price && (
                        <span className="text-xs text-[var(--text-muted)] line-through">
                          ₹{current.originalPrice?.toLocaleString()}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-[#5A7249] bg-[#5A7249]/10 px-2.5 py-0.5 rounded-full">
                        Includes Handwritten Letter &amp; Live Preview
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)]/40">
                    <div className="flex items-center gap-3">
                      <Link
                        href="/category/festival-hamper"
                        className="gold-btn px-6 py-3 text-[11px] font-semibold tracking-wide inline-flex items-center gap-2 shadow-xs"
                      >
                        <span>Explore Hamper</span>
                        <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
                      </Link>

                      <button
                        onClick={(e) => handleWhatsAppOrder(current, e)}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-[11px] font-medium text-[var(--text)] bg-[var(--card)] border border-[var(--border)] hover:border-[var(--olive)]/50 active:scale-98 transition-colors cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366] text-sm" />
                        <span>WhatsApp Order</span>
                      </button>
                    </div>

                    {/* Dot Selectors */}
                    <div className="flex items-center gap-2">
                      {activeItems.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            currentSlide === i
                              ? 'w-6 bg-[var(--text)]'
                              : 'w-2 bg-[var(--border)] hover:bg-[var(--text-muted)]'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Column */}
                <div className="lg:col-span-5 h-72 sm:h-80 lg:h-full relative overflow-hidden bg-[var(--bg-subtle)] border-t lg:border-t-0 lg:border-l border-[var(--border)]">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10.5px] font-semibold text-[var(--text)] border border-[var(--border)] shadow-xs">
                    ✨ {current.festivalName || current.festivalType}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[var(--card)]/90 hover:bg-[var(--card)] text-[var(--text)] border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-xs"
              aria-label="Previous"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
            </button>
            <button
              onClick={handleNextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-[var(--card)]/90 hover:bg-[var(--card)] text-[var(--text)] border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-xs"
              aria-label="Next"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FESTIVAL QUICK BENTO CARDS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14">
          {[
            {
              id: 'onam',
              title: 'Onam Curations',
              sub: 'Kasavu & Nilavilakku',
              tag: 'Thiruvonam',
              img: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=500&q=80',
            },
            {
              id: 'xmas',
              title: 'Christmas (X-Mas)',
              sub: 'Plum Cake & Cocoa',
              tag: 'Noël Specials',
              img: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=500&q=80',
            },
            {
              id: 'vishu',
              title: 'Vishu Editions',
              sub: 'Bell-Metal Uruli & Nuts',
              tag: 'Vishu Kani',
              img: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=500&q=80',
            },
            {
              id: 'bakrid',
              title: 'Eid & Bakrid',
              sub: 'Madinah Dates & Oud',
              tag: 'Barakah Gifts',
              img: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=500&q=80',
            },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFestivalTab(item.id)}
              className={`group text-left card-minimal p-3.5 sm:p-4 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
                activeFestivalTab === item.id
                  ? 'border-[var(--text)] ring-1 ring-[var(--text)] bg-[var(--card)]'
                  : 'bg-[var(--card)] hover:border-[var(--olive)]/50'
              }`}
            >
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[var(--bg-subtle)] mb-3">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 text-[9px] font-semibold bg-white/90 backdrop-blur-sm text-[var(--text)] px-2 py-0.5 rounded shadow-2xs">
                  {item.tag}
                </span>
              </div>
              <div>
                <h4 className="font-heading text-[13.5px] font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[var(--text-muted)] text-[11px] mt-0.5">
                  {item.sub}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* FESTIVAL PRODUCTS GRID WITH FILTER TABS */}
        {/* ========================================================================= */}
        <div className="mb-12">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span
                className="block mb-0.5 text-[var(--chandanam)]"
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: '22px' }}
              >
                Seasonal Atelier Gifts
              </span>
              <h3 className="font-heading text-2xl font-bold text-[var(--text)]">
                {activeFestivalTab === 'all'
                  ? 'All Festive Hampers'
                  : activeFestivalTab === 'onam'
                  ? 'Onam Festival Curations'
                  : activeFestivalTab === 'xmas'
                  ? 'Christmas & New Year Hampers'
                  : activeFestivalTab === 'vishu'
                  ? 'Vishu Kani Arrangements'
                  : 'Eid & Bakrid Curations'}
              </h3>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: 'All Festivals' },
                { id: 'onam', label: 'Onam' },
                { id: 'xmas', label: 'Christmas' },
                { id: 'vishu', label: 'Vishu' },
                { id: 'bakrid', label: 'Eid & Bakrid' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFestivalTab(tab.id)}
                  className={`text-[10.5px] px-3.5 py-1.5 rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                    activeFestivalTab === tab.id
                      ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                      : 'text-[var(--text-muted)] bg-[var(--card)] border border-[var(--border)] hover:text-[var(--text)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const isAdded = addedIds[item.id];
              return (
                <article
                  key={item.id}
                  className="card-minimal flex flex-col justify-between h-full group bg-[var(--card)] overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)]">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
                    />

                    {item.badge && (
                      <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[var(--text)] px-2.5 py-0.5 rounded-full border border-[var(--border)] shadow-xs">
                        {item.badge}
                      </span>
                    )}

                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="absolute top-3 right-3 text-[9.5px] font-bold bg-[#721C28] text-white px-2 py-0.5 rounded-full shadow-xs">
                        Save ₹{item.originalPrice - item.price}
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className="text-[var(--chandanam)]"
                          style={{ fontFamily: "'Great Vibes', cursive", fontSize: '15px' }}
                        >
                          {item.festivalName || 'Festival Hamper'}
                        </span>
                        <span className="text-[9.5px] font-medium text-[var(--olive)]">In Stock</span>
                      </div>

                      <h4 className="font-heading text-[0.95rem] font-bold text-[var(--text)] leading-snug line-clamp-1 mb-1">
                        {item.title}
                      </h4>

                      <p className="text-[var(--text-muted)] text-[11.5px] leading-relaxed line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-lg font-bold text-[var(--text)]">
                          ₹{item.price?.toLocaleString()}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[11px] text-[var(--text-muted)] line-through">
                            ₹{item.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]/60">
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-[10.5px] font-semibold active:scale-95 transition-all duration-300 cursor-pointer ${
                          isAdded
                            ? 'bg-[var(--olive)] text-white shadow-sm'
                            : 'bg-[var(--olive)] text-white hover:bg-[var(--olive-hover)] shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <FontAwesomeIcon icon={faCheck} className="text-[9px]" /> Added
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faBagShopping} className="text-[9px]" /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => handleWhatsAppOrder(item, e)}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-[10.5px] font-medium bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--olive)]/50 active:scale-95 transition-all duration-300 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366] text-xs" /> WhatsApp
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GIFTING ASSURANCES STRIP */}
        {/* ========================================================================= */}
        <div className="border-t border-[var(--border)]/60 pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-2">
            <DoodleSparkle className="w-3 h-3 text-[var(--chandanam)]" />
            <span>Live WhatsApp photo preview sent before dispatch</span>
          </div>
          <div className="flex items-center gap-2">
            <DoodleSparkle className="w-3 h-3 text-[var(--chandanam)]" />
            <span>Complimentary handwritten calligraphy note</span>
          </div>
          <div className="flex items-center gap-2">
            <DoodleSparkle className="w-3 h-3 text-[var(--chandanam)]" />
            <span>Pan-India secure shockproof shipping</span>
          </div>
          <div className="flex items-center gap-2">
            <DoodleSparkle className="w-3 h-3 text-[var(--chandanam)]" />
            <span>Handmade to order in Kerala atelier</span>
          </div>
        </div>

      </div>
    </section>
  );
}
