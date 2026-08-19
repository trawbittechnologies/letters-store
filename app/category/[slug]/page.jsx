'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useCategoryStore } from '@/src/store/categoryStore';
import { useProductStore } from '@/src/store/productStore';
import ProductCard from '@/src/components/ProductCard';
import { ArrowLeft, Gift, Sparkles } from 'lucide-react';

export default function CategoryPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const { categories } = useCategoryStore();
  const { products } = useProductStore();

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.slug === slug || c.id === slug);
  }, [categories, slug]);

  const matchingProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.active &&
        (p.categorySlug === slug ||
          (currentCategory && p.category.toLowerCase() === currentCategory.name.toLowerCase()))
    );
  }, [products, slug, currentCategory]);

  if (!currentCategory) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <Gift size={40} className="text-[var(--accent)] mb-4" />
        <h2 className="font-heading text-3xl font-bold text-[var(--text)] mb-2 uppercase tracking-wider">Category Not Found</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6">The category you are looking for does not exist or has been updated.</p>
        <Link href="/shop" className="gold-btn px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer">
          Explore All Gifts
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] mb-6 uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--text)]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--text)]">Shop</Link>
          <span>/</span>
          <span className="text-[var(--text)] font-bold">{currentCategory.name}</span>
        </div>

        {/* Category Hero Banner - Square Flat Frame */}
        <div className="border border-[var(--border-dark)] bg-[var(--card)] mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            
            <div className="md:col-span-7 p-8 sm:p-12">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg)] border border-[var(--border-dark)] text-[9px] font-bold tracking-[0.25em] uppercase mb-4 text-[var(--text)]">
                <Sparkles size={10} className="text-[var(--accent)]" /> {currentCategory.group}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] leading-tight mb-3">
                {currentCategory.name}
              </h1>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed max-w-xl mb-6">
                {currentCategory.description}
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--text)] hover:text-[var(--accent-hover)] transition-colors"
              >
                <ArrowLeft size={13} /> Back to all collections
              </Link>
            </div>

            <div className="md:col-span-5 h-64 md:h-full min-h-[220px] relative overflow-hidden bg-[var(--bg-subtle)] border-t md:border-t-0 md:border-l border-[var(--border)]">
              <img
                src={currentCategory.image}
                alt={currentCategory.name}
                className="w-full h-full object-cover grayscale-[10%]"
              />
            </div>

          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-6 pb-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider">
            Available {currentCategory.name} ({matchingProducts.length})
          </h2>
        </div>

        {matchingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {matchingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] border border-[var(--border)] p-12 text-center max-w-md mx-auto my-8">
            <p className="text-xs text-[var(--text-muted)] mb-4">No products are currently available in this category.</p>
            <Link href="/shop" className="gold-btn px-6 py-2.5 text-xs font-bold uppercase tracking-wider">
              Browse Other Gifts
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
