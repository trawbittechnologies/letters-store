'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, MessageCircle, Gift } from 'lucide-react';
import { useCartStore } from '@/src/store/cartStore';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, clearCart, getSubtotal } = useCartStore();
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const subtotal = getSubtotal();

  const handleWhatsAppQuickCart = () => {
    if (items.length === 0) return;

    let itemsText = '';
    items.forEach((item, index) => {
      itemsText += `${index + 1}. ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}\n`;
      if (item.customization?.recipientName || item.customization?.personalizedMessage) {
        itemsText += `   ↳ For: ${item.customization.recipientName || 'N/A'}${item.customization.personalizedMessage ? ` | Msg: "${item.customization.personalizedMessage}"` : ''}\n`;
      }
    });

    const message = `*${settings.orderMessagePrefix || 'New Order — LETTERS'}*
✦ *CART INQUIRY* ✦

*Items:*
${itemsText}
*Total:* ₹${subtotal}

Hello LETTERS team, I have prepared my cart and would like to proceed with ordering via WhatsApp!`;

    window.open(getWhatsAppUrl(message), '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-[var(--bg)]">
        <div className="w-16 h-16 bg-[var(--card)] border border-[var(--border-dark)] flex items-center justify-center mb-6">
          <ShoppingBag size={28} className="text-[var(--accent)]" />
        </div>
        <h2 className="font-heading text-3xl font-bold text-[var(--text)] mb-2 uppercase tracking-wider">Your Cart is Empty</h2>
        <p className="text-xs text-[var(--text-muted)] max-w-sm mb-8 leading-relaxed">
          Looks like you haven't added any luxury hampers or gifts to your cart yet.
        </p>
        <Link href="/shop" className="gold-btn px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em]">
          Explore Gifts Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Gift size={12} className="text-[var(--accent)]" />
              <p className="text-[9.5px] tracking-[0.3em] text-[var(--accent-secondary)] uppercase font-bold">
                Your Selection
              </p>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--text)]">
              Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-[var(--text-muted)] hover:text-rose-500 transition-colors flex items-center gap-1 font-bold uppercase tracking-wider cursor-pointer"
          >
            <Trash2 size={13} /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left / Center: Items Table / List - Square Flat */}
          <div className="lg:col-span-8 space-y-3">
            {items.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-[var(--card)] border border-[var(--border)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Basic Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-16 h-16 bg-[var(--bg-subtle)] border border-[var(--border)] flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-[var(--accent-secondary)]">
                      {item.category}
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[var(--text)] line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-[var(--accent-hover)] font-heading">
                      ₹{item.price.toLocaleString()} each
                    </p>

                    {/* Customization Preview */}
                    {(item.customization?.recipientName || item.customization?.personalizedMessage) && (
                      <div className="mt-1 text-[9.5px] text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 border border-[var(--border)] inline-block">
                        <span className="font-bold text-[var(--text)]">For: </span>
                        {item.customization.recipientName || 'Not specified'}
                        {item.customization.personalizedMessage && (
                          <span className="italic"> • "{item.customization.personalizedMessage}"</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Modifiers & Total - Square Steppers */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                  
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[var(--border-dark)] bg-[var(--bg)]">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-[var(--card)] text-[var(--text)] transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono text-[var(--text)] border-x border-[var(--border)]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-[var(--card)] text-[var(--text)] transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal for line item */}
                  <div className="text-right min-w-[70px]">
                    <span className="font-heading text-sm font-bold text-[var(--text)]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Delete Item Button */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-[var(--text-muted)] hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <ArrowLeft size={13} /> Continue Exploring Gifts
              </Link>
            </div>
          </div>

          {/* Right: Order Summary - Square Sticky Flat */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-[var(--card)] border border-[var(--border-dark)] p-6 space-y-6">
              
              <div className="border-b border-[var(--border)] pb-3">
                <h3 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider">Order Summary</h3>
                <p className="text-[9.5px] text-[var(--text-muted)] uppercase tracking-wider">Verified price calculation</p>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[var(--text)]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span>Shipping</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase text-[10px] tracking-wider">Calculated at Checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Total</span>
                <span className="font-heading text-2xl font-bold text-[var(--text)]">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>

              {/* CTAs - Square Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full gold-btn py-3.5 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em]"
                >
                  Proceed to Checkout <ArrowRight size={14} className="ml-2" />
                </button>

                <button
                  onClick={handleWhatsAppQuickCart}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em] bg-[#25D366] text-white hover:bg-[#1EBE5D] border border-[#25D366] transition-colors cursor-pointer"
                >
                  <MessageCircle size={15} className="fill-current" /> Order on WhatsApp
                </button>
              </div>

              <div className="text-[9.5px] text-center text-[var(--text-muted)] pt-2 border-t border-[var(--border)] space-y-1 uppercase tracking-wider">
                <p>🔒 Secure order registration & WhatsApp dispatch</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
