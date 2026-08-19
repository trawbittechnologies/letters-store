'use client';

import { useState } from 'react';
import { ShoppingBag, MessageCircle, Eye, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { useSettingsStore } from '../store/settingsStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { getWhatsAppUrl } = useSettingsStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const message = `*New Order Inquiry — LETTERS*
Item: ${product.name}
Category: ${product.category}
Price: ₹${product.price}
Product Link: ${origin}/product/${product.slug}

Hello LETTERS team, I would like to order this item directly via WhatsApp. Please guide me with delivery and payment details.`;

    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <article className="card-minimal flex flex-col justify-between h-full group bg-[var(--card)] overflow-hidden">
      {/* Product Image Box */}
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] border-b border-[var(--border)]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Soft Pill Tag */}
        {product.tag && (
          <span className="absolute top-3 left-3 text-[11px] font-medium tracking-normal bg-[#FFFDF9]/90 dark:bg-[#161513]/90 backdrop-blur-md text-[var(--text)] px-3 py-1 rounded-full border border-[#DDD3C4]/60 dark:border-[#332F2A] pointer-events-none shadow-sm capitalize">
            {product.tag.toLowerCase()}
          </span>
        )}

        {product.customizable && (
          <span className="absolute top-3 right-3 text-[11px] font-medium tracking-normal bg-[#FFFDF9]/90 dark:bg-[#161513]/90 backdrop-blur-md text-[var(--text)] px-2.5 py-1 rounded-full border border-[#DDD3C4]/60 dark:border-[#332F2A] flex items-center gap-1 pointer-events-none shadow-sm">
            <Sparkles size={11} className="text-[var(--accent)]" />
            <span>Custom</span>
          </span>
        )}

        {/* Quick View Overlay Button */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 backdrop-blur-[2px]"
        >
          <span className="bg-[#FFFDF9] text-[#1C1C1A] dark:bg-[#161513] dark:text-[#F8F4EC] px-4 py-2 rounded-full text-xs font-medium tracking-wide shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye size={13} /> View Details
          </span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-medium text-[var(--text-muted)] tracking-wide">
              {product.category}
            </span>
            {product.stock > 0 ? (
              <span className="text-[11px] font-semibold text-[#71806C]">In Stock</span>
            ) : (
              <span className="text-[11px] font-medium text-[var(--text-muted)]">Made to order</span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[var(--accent-hover)] transition-colors">
            <h3 className="font-heading text-base font-semibold text-[var(--text)] leading-snug line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          <p className="text-[var(--text-muted)] text-xs leading-relaxed line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-[var(--text)]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[var(--text-muted)] line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Dual Actions - Pill Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-medium tracking-wide active:scale-95 transition-all duration-300 cursor-pointer ${
              added
                ? 'bg-[#71806C] text-white border border-[#71806C]'
                : 'bg-[#1C1C1A] text-[#FFFDF9] dark:bg-[#F8F4EC] dark:text-[#1C1C1A] hover:bg-[#C9A46C] hover:text-[#1C1C1A] dark:hover:bg-[#C9A46C]'
            }`}
          >
            {added ? (
              <>
                <Check size={13} strokeWidth={2.5} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={13} /> Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-xs font-medium tracking-wide bg-[var(--bg-subtle)] text-[var(--text)] border border-[var(--border)] hover:bg-[#DDD3C4] active:scale-95 transition-all duration-300 cursor-pointer"
            title="Order directly on WhatsApp"
          >
            <MessageCircle size={13} className="text-[#71806C]" /> WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}
