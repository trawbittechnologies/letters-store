'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faCheck,
  faWandMagicSparkles,
  faShieldHalved,
  faTruck,
  faGift,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
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
        <FontAwesomeIcon icon={faGift} className="text-[var(--olive)] text-3xl mb-4" />
        <h2 className="font-heading text-2xl font-bold text-[var(--text)] mb-2">Product Not Found</h2>
        <p className="text-xs text-[var(--text-muted)] mb-6">The gift item you requested could not be located.</p>
        <Link href="/shop" className="gold-btn px-6 py-3 text-xs font-semibold">
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
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--text)]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[var(--text)]">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.categorySlug || 'hampers'}`} className="hover:text-[var(--text)]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start mb-20">
          
          {/* Left Column: Product Gallery */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-square bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-xs">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-400"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[var(--text)] px-3 py-1 rounded-full border border-[var(--border)] shadow-xs capitalize">
                  {product.tag.toLowerCase()}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 rounded-xl border-2 transition-all flex-shrink-0 cursor-pointer overflow-hidden ${
                      selectedImage === idx
                        ? 'border-[var(--olive)] shadow-xs'
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
            <div className="flex items-center justify-between gap-4 mb-2">
              <span
                className="text-[var(--chandanam)]"
                style={{ fontFamily: "'Great Vibes', cursive", fontSize: '20px' }}
              >
                {product.category}
              </span>
              <div className="text-xs text-[var(--text-muted)] font-medium">
                5.0 ★ Studio Verified
              </div>
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text)] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Pricing & Stock */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[var(--border)]">
              <span className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text)]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[var(--text-muted)] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-[var(--olive)] ml-auto">
                {product.stock > 0 ? `${product.stock} in Stock` : 'Made to Order'}
              </span>
            </div>

            {/* Description */}
            <div className="text-xs text-[var(--text-muted)] leading-relaxed mb-6 font-normal">
              <p>{product.description}</p>
            </div>

            {/* Customization Section */}
            {product.customizable && (
              <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 mb-6 space-y-3.5 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-[var(--border)]">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[var(--chandanam)] text-xs" />
                  <span className="text-xs font-bold text-[var(--text)]">Personalize This Gift</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter recipient name (e.g. Sarah / Mom & Dad)"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="input-warm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Personalized Message Card
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Heartfelt message for keepsake card..."
                    value={personalizedMessage}
                    onChange={(e) => setPersonalizedMessage(e.target.value)}
                    className="input-warm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                    Special Instructions
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. specific delivery date, eggless chocolates"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="input-warm"
                  />
                </div>
              </div>
            )}

            {/* Quantity Selector & CTAs */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[var(--text-muted)]">
                  Quantity:
                </span>
                <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-xs font-bold hover:bg-[var(--bg)] text-[var(--text)] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-[var(--text)]">
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
                  className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    added ? 'bg-emerald-600 text-white shadow-sm' : 'gold-btn'
                  }`}
                >
                  {added ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} className="text-xs" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faBagShopping} className="text-xs" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="secondary-pill-btn flex items-center justify-center gap-2 py-3.5 px-6 text-xs font-semibold cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full text-xs font-semibold bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors cursor-pointer shadow-xs"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" />
                Order on WhatsApp Directly
              </button>
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] text-center shadow-xs">
              <div className="p-2">
                <FontAwesomeIcon icon={faGift} className="mx-auto text-[var(--olive)] mb-1.5 text-sm block" />
                <p className="text-[10px] font-bold text-[var(--text)]">Luxe Box</p>
                <p className="text-[9px] text-[var(--text-muted)]">Ribbon Tied</p>
              </div>
              <div className="p-2">
                <FontAwesomeIcon icon={faCamera} className="mx-auto text-emerald-600 mb-1.5 text-sm block" />
                <p className="text-[10px] font-bold text-[var(--text)]">Live Preview</p>
                <p className="text-[9px] text-[var(--text-muted)]">Via WhatsApp</p>
              </div>
              <div className="p-2">
                <FontAwesomeIcon icon={faTruck} className="mx-auto text-[var(--maroon)] mb-1.5 text-sm block" />
                <p className="text-[10px] font-bold text-[var(--text)]">Pan-India</p>
                <p className="text-[9px] text-[var(--text-muted)]">Tracked Dispatch</p>
              </div>
              <div className="p-2">
                <FontAwesomeIcon icon={faShieldHalved} className="mx-auto text-[var(--chandanam)] mb-1.5 text-sm block" />
                <p className="text-[10px] font-bold text-[var(--text)]">Artisanal</p>
                <p className="text-[9px] text-[var(--text-muted)]">Quality Tested</p>
              </div>
            </div>

          </div>

        </div>

        {/* Related Gifts */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[var(--border)]">
            <span
              className="block mb-1 text-[var(--chandanam)]"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '24px' }}
            >
              Recommended Curations
            </span>
            <h2 className="font-heading text-2xl font-bold text-[var(--text)] mb-8">
              You May Also Cherish
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
