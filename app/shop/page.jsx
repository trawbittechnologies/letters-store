'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Gift, X } from 'lucide-react';
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
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }
        if (p.price > maxPrice) {
          return false;
        }
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

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10 text-left pb-6 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--card)] border border-[var(--border-dark)] text-[9.5px] font-bold tracking-[0.25em] uppercase text-[var(--text)] mb-3">
            <Gift size={11} />
            LETTERS Curations
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] leading-tight tracking-tight mb-2">
            The Gifting Catalog
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base max-w-2xl leading-relaxed">
            Browse our complete atelier collection of handcrafted hampers, floral arrangements, chocolate bouquets, and personalized keepsakes.
          </p>
        </div>

        {/* Search, Filter & Controls Bar - Square */}
        <div className="bg-[var(--card)] border border-[var(--border-dark)] p-5 sm:p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search hampers, bouquets, photo frames..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)]/70 focus:outline-none focus:border-[var(--border-dark)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Price Filter Slider */}
            <div className="md:col-span-3 flex flex-col justify-center px-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                <span>Max Budget</span>
                <span className="text-[var(--text)] font-semibold">₹{maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[var(--text)] cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-3 px-3 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-semibold focus:outline-none focus:border-[var(--border-dark)] cursor-pointer"
              >
                <option value="featured">Sort by: Featured Picks</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Alphabetical: A to Z</option>
              </select>
            </div>

          </div>

          {/* Category Filter Pills - Square */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-4 mt-4 border-t border-[var(--border)] pb-1 scrollbar-none">
            <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[var(--text-muted)] flex-shrink-0 flex items-center gap-1 mr-1">
              <SlidersHorizontal size={10} /> Filter:
            </span>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] uppercase tracking-[0.18em] px-3.5 py-2 border transition-colors flex-shrink-0 font-bold cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[var(--text)] text-[var(--bg)] border-[var(--text)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-dark)] hover:text-[var(--text)] bg-[var(--bg)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--text-muted)] font-medium">
          <span>
            Showing <strong className="text-[var(--text)]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'curation' : 'curations'}
            {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          </span>
          {(selectedCategory !== 'All' || searchQuery || maxPrice < 5000) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(5000);
              }}
              className="text-[var(--accent-secondary)] hover:underline flex items-center gap-1 font-bold cursor-pointer uppercase text-[10px] tracking-wider"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-[var(--card)] border border-[var(--border)] p-12 text-center max-w-md mx-auto my-12">
            <Gift size={32} className="mx-auto text-[var(--accent)] mb-3 opacity-60" />
            <h3 className="font-heading text-lg font-bold text-[var(--text)] mb-2">No Gifts Match Your Search</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
              Try adjusting your category filter, budget slider, or search keyword.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(5000);
              }}
              className="gold-btn px-6 py-3 text-xs font-bold uppercase tracking-wider"
            >
              Show All Gifts
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
