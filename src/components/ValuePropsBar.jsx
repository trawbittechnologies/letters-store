'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useFestivalStore } from '../store/festivalStore';

export default function ValuePropsBar() {
  const { festivalHampers, fetchFestivalHampers } = useFestivalStore();

  useEffect(() => {
    fetchFestivalHampers();
  }, [fetchFestivalHampers]);

  const activeFestivalItems = useMemo(() => {
    return (festivalHampers?.items || []).filter((it) => it.enabled !== false);
  }, [festivalHampers]);

  const hasActiveFestival = festivalHampers?.enabled && activeFestivalItems.length > 0;

  if (!hasActiveFestival) {
    return null;
  }

  return (
    <aside
      aria-label="Festival Hampers Live Notification"
      className="relative z-20 bg-gradient-to-r from-[#1C2519] via-[#283623] to-[#1C2519] text-[#FAF6EE] border-y border-[#3E5337] py-3.5 px-4 sm:px-6 lg:px-12 select-none shadow-xs transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5 text-center md:text-left font-sans-ui">
        
        {/* Left: Festive Badge & Announcement */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[var(--chandanam)] text-[#1C2519] px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5 font-sans-ui">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[9px]" />
            {festivalHampers.badge || 'FESTIVAL SPECIAL'}
          </span>

          <p className="text-xs sm:text-[13.5px] font-semibold text-[#FAF6EE] tracking-wide">
            {festivalHampers.title || 'Limited Edition Festive Hampers Now Live'}
            <span className="opacity-75 font-normal ml-2 hidden lg:inline">
              — {festivalHampers.subtitle || 'Reserve your handcrafted festive gift boxes before stocks end.'}
            </span>
          </p>
        </div>

        {/* Right: Active Festival Thumbnails Preview & High-Contrast CTA Button */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Overlapping Product Thumbnails */}
          {activeFestivalItems.length > 0 && (
            <div className="hidden sm:flex items-center -space-x-2.5 overflow-hidden py-0.5">
              {activeFestivalItems.slice(0, 3).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shadow-xs bg-white flex-shrink-0"
                >
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <Link
            href="#festival"
            className="px-4.5 py-1.5 rounded-full bg-white text-[#1C2519] hover:bg-[#F5EFE4] text-xs font-bold tracking-tight transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:scale-103 cursor-pointer"
          >
            <span>Explore Festival Hampers</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[9px] text-[var(--olive)]" />
          </Link>
        </div>

      </div>
    </aside>
  );
}
