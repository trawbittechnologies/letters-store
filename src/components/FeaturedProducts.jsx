'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { products } = useProductStore();
  const [activeTab, setActiveTab] = useState('All');

  const filterTabs = ['All', 'Signature Hampers', 'Bouquets & Florals', 'Bespoke Keepsakes'];

  const filteredProducts = products
    .filter((p) => {
      if (!p.active) return false;
      if (activeTab === 'All') return true;
      if (activeTab === 'Signature Hampers')
        return p.category.toLowerCase().includes('hamper') || p.category.toLowerCase().includes('engagement') || p.category.toLowerCase().includes('chocolate');
      if (activeTab === 'Bouquets & Florals')
        return p.category.toLowerCase().includes('bouquet') || p.category.toLowerCase().includes('flower');
      if (activeTab === 'Bespoke Keepsakes')
        return p.category.toLowerCase().includes('frame') || p.category.toLowerCase().includes('prayer') || p.customizable;
      return true;
    })
    .slice(0, 8);

  return (
    <section id="featured" className="py-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-t border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-[var(--accent)]" />
              <p className="text-[10px] tracking-[0.3em] text-[var(--accent-secondary)] uppercase font-bold">
                Most Cherished Curations
              </p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight tracking-tight">
              Curated with Care
            </h2>
          </div>

          {/* Square Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[10px] uppercase tracking-[0.18em] px-4 py-2.5 border transition-colors font-bold cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)] hover:text-[var(--text)] bg-[var(--card)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom CTA to Shop */}
        <div className="text-center">
          <Link
            href="/shop"
            className="gold-btn px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em]"
          >
            Explore Complete Gifting Catalog <ArrowRight size={14} className="ml-2" />
          </Link>
        </div>

      </div>
    </section>
  );
}
