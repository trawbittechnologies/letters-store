'use client';

import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGift, faXmark, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { useProductStore } from '@/src/store/productStore';
import { useCategoryStore } from '@/src/store/categoryStore';
import ProductCard from '@/src/components/ProductCard';

export default function ShopPage() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(5000);

  const categoryList = useMemo(() => {
    return ['All', ...categories.filter((c) => c.enabled).map((c) => c.name)];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.active) return false;
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (p.price > maxPrice) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = (p.description || '').toLowerCase().includes(q);
          const matchesCat = (p.category || '').toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, sortBy, maxPrice]);

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery || maxPrice < 5000;

  return (
    <div className="min-h-screen pt-10 pb-28 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 pb-7 border-b border-[var(--border)]">
          <span
            className="block mb-1 text-[var(--chandanam)]"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: '26px', letterSpacing: '0.02em' }}
          >
            LETTERS Curations
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] leading-tight tracking-tight mb-2">
            The Gifting Catalog
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-2xl leading-relaxed">
            Browse our complete atelier collection of handcrafted hampers, floral arrangements, chocolate bouquets, and personalized keepsakes.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 sm:p-6 mb-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-5">
            
            {/* Search */}
            <div className="md:col-span-6 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
              <input
                type="text"
                placeholder="Search hampers, bouquets, photo frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-warm pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              )}
            </div>

            {/* Price Slider */}
            <div className="md:col-span-3 flex flex-col justify-center px-1">
              <div className="flex justify-between items-center text-[10.5px] font-semibold text-[var(--text-muted)] mb-1.5">
                <span>Max Budget</span>
                <span className="text-[var(--text)]">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--olive)] cursor-pointer"
              />
            </div>

            {/* Sort */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-warm cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">A to Z</option>
              </select>
            </div>

          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-[var(--border)] pb-1 scrollbar-none">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] flex-shrink-0 mr-1 flex items-center gap-1">
              <FontAwesomeIcon icon={faSlidersH} className="text-[10px]" /> Filter
            </span>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10.5px] px-3.5 py-1.5 rounded-full border transition-all flex-shrink-0 font-semibold cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-dark)]/40 hover:text-[var(--text)] bg-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--text-muted)]">
          <span>
            Showing <strong className="text-[var(--text)]">{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'curation' : 'curations'}
            {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(5000); }}
              className="text-[var(--accent-secondary)] hover:underline font-semibold cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-12 text-center max-w-md mx-auto my-12">
            <FontAwesomeIcon icon={faGift} className="mx-auto text-[var(--chandanam)] mb-4 text-3xl opacity-60" />
            <h3 className="font-heading text-lg font-bold text-[var(--text)] mb-2">No Gifts Match Your Search</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
              Try adjusting your category filter, budget slider, or search keyword.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setMaxPrice(5000); }}
              className="gold-btn px-6 py-3 text-xs font-semibold tracking-[0.05em]"
            >
              Show All Gifts
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
