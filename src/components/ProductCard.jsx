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
    <article className="card-minimal flex flex-col justify-between h-full group bg-[var(--card)]">
      {/* Product Image Box - Square */}
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] border-b border-[var(--border)]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-104 transition-all duration-400"
          />
        </Link>

        {/* Square Tag Pill */}
        {product.tag && (
          <span className="absolute top-2.5 left-2.5 text-[8.5px] font-bold tracking-[0.2em] uppercase bg-[var(--card)] text-[var(--text)] px-2.5 py-1 border border-[var(--border-dark)] pointer-events-none">
            {product.tag}
          </span>
        )}

        {product.customizable && (
          <span className="absolute top-2.5 right-2.5 text-[8.5px] font-bold tracking-[0.15em] uppercase bg-[var(--card)] text-[var(--text)] px-2 py-1 border border-[var(--border)] flex items-center gap-1 pointer-events-none">
            <Sparkles size={9} className="text-[var(--accent)]" /> Custom
          </span>
        )}

        {/* Quick View Overlay Button */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
        >
          <span className="bg-[var(--card)] text-[var(--text)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] border border-[var(--border-dark)] flex items-center gap-1.5">
            <Eye size={12} /> View Details
          </span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
              {product.category}
            </span>
            {product.stock > 0 ? (
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">In Stock</span>
            ) : (
              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-500">Made to Order</span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[var(--accent-hover)] transition-colors">
            <h3 className="font-heading text-base font-bold text-[var(--text)] leading-snug line-clamp-1 mb-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-[var(--text-muted)] text-[11px] leading-relaxed line-clamp-2 mb-2.5">
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

        {/* Dual Actions - Square Flat Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-2.5 border-t border-[var(--border)]">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors cursor-pointer border ${
              added
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'gold-btn'
            }`}
          >
            {added ? (
              <>
                <Check size={12} strokeWidth={3} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={12} /> Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 text-[10px] font-bold uppercase tracking-[0.15em] bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors border border-[#25D366] cursor-pointer"
            title="Order directly on WhatsApp"
          >
            <MessageCircle size={12} className="fill-current" /> WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}
