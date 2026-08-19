'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MessageCircle, Check, Sparkles, ShieldCheck, Truck, Gift } from 'lucide-react';
import { useProductStore } from '@/src/store/productStore';
import { useCartStore } from '@/src/store/cartStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import ProductCard from '@/src/components/ProductCard';

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;

  const router = useRouter();
  const { products, getProductBySlug } = useProductStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const product = getProductBySlug(slug) || products.find((p) => p.slug === slug || p.id === slug);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  // Customization fields
  const [recipientName, setRecipientName] = useState('');
  const [personalizedMessage, setPersonalizedMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <Gift size={40} className="text-[var(--accent)] mb-4" />
        <h2 className="font-heading text-3xl font-bold text-[var(--text)] mb-2 uppercase tracking-wider">Product Not Found</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6">The gift item you requested could not be located.</p>
        <Link href="/shop" className="gold-btn px-6 py-3 text-xs font-bold uppercase tracking-[0.2em]">
          Explore All Gifts
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'];

  const handleAddToCart = () => {
    addToCart(product, quantity, {
      recipientName,
      personalizedMessage,
      specialInstructions,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, {
      recipientName,
      personalizedMessage,
      specialInstructions,
    });
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    let customDetails = '';
    if (recipientName || personalizedMessage || specialInstructions) {
      customDetails = `\nCustomization for Order:\n• Recipient Name: ${recipientName || 'Not specified'}\n• Message: ${personalizedMessage || 'None'}\n• Instructions: ${specialInstructions || 'None'}`;
    }

    const message = `*${settings.orderMessagePrefix || 'New Order — LETTERS'}*

Item: ${product.name}
Category: ${product.category}
Quantity: ${quantity}
Price per unit: ₹${product.price}
Total: ₹${product.price * quantity}
Product Link: ${origin}/product/${product.slug}${customDetails}

Please confirm availability and help me complete this order.`;

    window.open(getWhatsAppUrl(message), '_blank');
  };

  const relatedProducts = products
    .filter((p) => p.active && p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8 uppercase tracking-wider text-[10px]">
          <Link href="/" className="hover:text-[var(--text)]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--text)]">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug || 'hampers'}`} className="hover:text-[var(--text)]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* Left Column: Product Gallery - Square */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-square bg-[var(--card)] border border-[var(--border-dark)] overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-400"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 text-[9px] font-bold tracking-[0.2em] uppercase bg-[var(--card)] text-[var(--text)] px-3 py-1 border border-[var(--border-dark)]">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 border transition-colors flex-shrink-0 cursor-pointer overflow-hidden ${
                      selectedImage === idx
                        ? 'border-[var(--text)]'
                        : 'border-[var(--border)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Order Action */}
          <div className="lg:col-span-6 flex flex-col justify-start">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--accent-secondary)]">
                {product.category}
              </span>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                5.0 ★ Verified Hamper
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Pricing & Stock */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-[var(--border)]">
              <span className="font-heading text-3xl font-bold text-[var(--text)]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[var(--text-muted)] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[var(--card)] border border-[var(--border-dark)] ml-auto">
                {product.stock > 0 ? `${product.stock} in Stock` : 'Made to Order'}
              </span>
            </div>

            {/* Description */}
            <div className="text-xs text-[var(--text-muted)] leading-relaxed mb-6 font-normal">
              <p>{product.description}</p>
            </div>

            {/* Customization Section */}
            {product.customizable && (
              <div className="bg-[var(--card)] border border-[var(--border-dark)] p-5 mb-6 space-y-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text)] pb-2 border-b border-[var(--border)]">
                  <Sparkles size={12} className="text-[var(--accent)]" />
                  Personalize This Gift
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter recipient name (e.g. Sarah / Mom & Dad)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Personalized Message Card
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Heartfelt message for keepsake card..."
                    value={personalizedMessage}
                    onChange={(e) => setPersonalizedMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>

                <div>
                  <label className="block text-[9.5px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. specific delivery date, eggless chocolates"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>
              </div>
            )}

            {/* Quantity Selector & CTAs - Square Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[var(--border-dark)] bg-[var(--card)]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold hover:bg-[var(--bg)] text-[var(--text)] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-xs font-bold font-mono text-[var(--text)] border-x border-[var(--border)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold hover:bg-[var(--bg)] text-[var(--text)] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 py-3.5 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em] transition-colors cursor-pointer border ${
                    added ? 'bg-emerald-600 text-white border-emerald-600' : 'gold-btn'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={14} strokeWidth={3} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="rose-btn flex items-center justify-center gap-2 py-3.5 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em] cursor-pointer"
                >
                  Proceed to Order
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em] bg-[#25D366] text-white hover:bg-[#1EBE5D] border border-[#25D366] transition-colors cursor-pointer"
              >
                <MessageCircle size={16} className="fill-current" />
                Order on WhatsApp Instantly
              </button>
            </div>

            {/* Trust Points - Square Flat Grid */}
            <div className="grid grid-cols-3 gap-0 border border-[var(--border)] mt-8 divide-x divide-[var(--border)] bg-[var(--card)] text-center">
              <div className="p-3">
                <Gift size={15} className="mx-auto text-[var(--accent)] mb-1" />
                <p className="text-[9.5px] font-bold uppercase text-[var(--text)]">Packaging</p>
                <p className="text-[8.5px] text-[var(--text-muted)] uppercase">Ribboned</p>
              </div>
              <div className="p-3">
                <Truck size={15} className="mx-auto text-[var(--accent-secondary)] mb-1" />
                <p className="text-[9.5px] font-bold uppercase text-[var(--text)]">Delivery</p>
                <p className="text-[8.5px] text-[var(--text-muted)] uppercase">Tracked</p>
              </div>
              <div className="p-3">
                <ShieldCheck size={15} className="mx-auto text-[var(--accent)] mb-1" />
                <p className="text-[9.5px] font-bold uppercase text-[var(--text)]">Freshness</p>
                <p className="text-[8.5px] text-[var(--text-muted)] uppercase">Artisanal</p>
              </div>
            </div>

          </div>

        </div>

        {/* Related Gifts */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[var(--border)]">
            <h2 className="font-heading text-2xl font-bold text-[var(--text)] mb-8 uppercase tracking-wider">
              You May Also Adore
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
