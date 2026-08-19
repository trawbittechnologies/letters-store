'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCategoryStore } from '../store/categoryStore';

export default function FeaturedCategories() {
  const { categories } = useCategoryStore();
  const enabledCategories = categories.filter((c) => c.enabled);

  return (
    <section id="categories" className="py-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className="text-[var(--accent)]" />
              <p className="text-[10px] tracking-[0.3em] text-[var(--accent-secondary)] uppercase font-bold">
                Thoughtful Collections
              </p>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight tracking-tight">
              Curated by Sentiment
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--text)] hover:text-[var(--accent-hover)] transition-colors"
          >
            All Collections 
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 12 Categories Grid - Square Flat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {enabledCategories.map((cat) => (
            <div
              key={cat.id}
              className="card-minimal flex flex-col justify-between group"
            >
              <Link href={`/category/${cat.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-subtle)] border-b border-[var(--border)]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-104 transition-all duration-400"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[8.5px] font-bold tracking-[0.2em] uppercase bg-[var(--card)] text-[var(--text)] px-2 py-1 border border-[var(--border-dark)]">
                    {cat.group}
                  </span>
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div className="mb-4">
                    <h3 className="font-heading text-lg font-bold text-[var(--text)] mb-1 group-hover:text-[var(--accent-hover)] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[var(--text-muted)] text-[11.5px] leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">
                    <span>Explore Gifts</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
