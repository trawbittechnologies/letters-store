'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faEye,
  faCheck,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
    const message = `*New Order Inquiry — LETTERS*\nItem: ${product.name}\nCategory: ${product.category}\nPrice: ₹${product.price}\nProduct Link: ${origin}/product/${product.slug}\n\nHello LETTERS team, I would like to order this item directly via WhatsApp. Please guide me with delivery and payment details.`;

    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <article className="card-minimal flex flex-col justify-between h-full group bg-[var(--card)] overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Tag Pill */}
        {product.tag && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[var(--text)] px-3 py-1 rounded-full border border-[var(--border)] pointer-events-none shadow-xs capitalize">
            {product.tag.toLowerCase()}
          </span>
        )}

        {product.customizable && (
          <span className="absolute top-3 right-3 text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[var(--olive)] px-2.5 py-1 rounded-full border border-[var(--border)] flex items-center gap-1.5 pointer-events-none shadow-xs">
            <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[var(--chandanam)] text-[9px]" />
            <span>Custom</span>
          </span>
        )}

        {/* Quick View Overlay */}
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]"
        >
          <span className="bg-white/95 backdrop-blur-md text-[var(--text)] px-4 py-2 rounded-full text-[11px] font-semibold tracking-wide shadow-md flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <FontAwesomeIcon icon={faEye} className="text-[10px] text-[var(--olive)]" /> View Details
          </span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className="text-[var(--chandanam)]"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '15px' }}
            >
              {product.category}
            </span>
            {product.stock > 0 ? (
              <span className="text-[9.5px] font-medium text-[var(--olive)]">In Stock</span>
            ) : (
              <span className="text-[9.5px] font-medium text-[var(--text-muted)]">Made to order</span>
            )}
          </div>

          <Link href={`/product/${product.slug}`} className="block group-hover:text-[var(--accent)] transition-colors duration-200">
            <h3 className="font-heading text-[0.95rem] font-bold text-[var(--text)] leading-snug line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          <p className="text-[var(--text-muted)] text-[11.5px] leading-relaxed line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-[var(--text)]">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-[var(--text-muted)] line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]/60">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-[11px] font-semibold active:scale-95 transition-all duration-300 cursor-pointer ${
              added
                ? 'bg-[var(--olive)] text-white shadow-sm'
                : 'bg-[var(--olive)] text-white hover:bg-[var(--olive-hover)] shadow-xs'
            }`}
          >
            {added ? (
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
            onClick={handleWhatsAppOrder}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full text-[11px] font-medium bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--olive)]/50 active:scale-95 transition-all duration-300 cursor-pointer"
            title="Order directly on WhatsApp"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-[#25D366] text-sm" /> WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}
