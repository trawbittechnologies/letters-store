'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPercent,
  faBolt,
  faClock,
  faSave,
  faTag,
  faEye,
  faCheck,
  faSliders,
  faCircleCheck,
  faUpload,
  faBox,
  faSearch,
  faPlus,
  faMinus,
  faLayerGroup,
  faFire,
} from '@fortawesome/free-solid-svg-icons';
import { useSaleBannerStore } from '@/src/store/saleBannerStore';
import { useProductStore } from '@/src/store/productStore';

export default function AdminSaleBannerPage() {
  const { saleBanner, fetchSaleBanner, updateSaleBanner } = useSaleBannerStore();
  const { products, updateProduct } = useProductStore();

  const [formData, setFormData] = useState(saleBanner);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSaleBanner();
  }, [fetchSaleBanner]);

  useEffect(() => {
    if (saleBanner) {
      setFormData({
        ...saleBanner,
        selectedProductIds: saleBanner.selectedProductIds || ['prod-1', 'prod-2', 'prod-3', 'prod-5', 'prod-6', 'prod-7'],
      });
    }
  }, [saleBanner]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle a single product in or out of the sale
  const handleToggleProductInSale = (productId) => {
    setFormData((prev) => {
      const currentIds = prev.selectedProductIds || [];
      const exists = currentIds.includes(productId);
      const updated = exists
        ? currentIds.filter((id) => id !== productId)
        : [...currentIds, productId];
      return { ...prev, selectedProductIds: updated };
    });
  };

  // Select all / Deselect all
  const handleSelectAll = () => {
    const allIds = products.map((p) => p.id);
    setFormData((prev) => ({ ...prev, selectedProductIds: allIds }));
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({ ...prev, selectedProductIds: [] }));
  };

  // Apply a quick discount % to a specific product
  const handleApplyProductDiscount = async (product, percent) => {
    const orig = product.originalPrice || Math.round(product.price * 1.3);
    const newPrice = Math.round(orig * (1 - percent / 100));
    await updateProduct(product.id, {
      originalPrice: orig,
      price: newPrice,
    });
  };

  // Handle local image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Please upload an image smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleChange('image', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSaleBanner(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate remaining time for preview
  const calculateRemaining = () => {
    if (!formData.endDate) return 'No timer set';
    const diff = new Date(formData.endDate).getTime() - Date.now();
    if (diff <= 0) return 'Sale Expired';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${mins}m remaining`;
  };

  // Filtered products list for the selector
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategoryTab !== 'All' && p.category !== selectedCategoryTab) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedCategoryTab, productSearch]);

  const categoriesList = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const selectedCount = (formData.selectedProductIds || []).length;

  return (
    <div className="space-y-8 max-w-7xl pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--maroon)] text-white text-xs">
              <FontAwesomeIcon icon={faPercent} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-secondary)]">
              Marketing &amp; Promotions
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Mega Sale &amp; Discounted Items Manager
          </h1>
          <p className="text-xs sm:text-[13px] text-[var(--text-muted)] mt-1">
            Control the billboard banner, countdown timer, and <strong>select specific products to include in the sale</strong> with custom discounts.
          </p>
        </div>

        {/* Global Sale Status Badge & Save Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--card)] px-4 py-2 rounded-full border border-[var(--border)] shadow-2xs">
            <span className={`w-2.5 h-2.5 rounded-full ${formData.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-bold">
              {formData.enabled ? `${selectedCount} Items in Active Sale` : 'Sale Section Hidden'}
            </span>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="gold-btn px-6 py-2.5 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="text-xs" />
                <span>Save &amp; Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl flex items-center gap-3 text-xs font-semibold animate-fadeIn">
          <FontAwesomeIcon icon={faCircleCheck} className="text-base text-emerald-500" />
          <span>Mega Sale Banner &amp; selected sale products updated successfully! Public storefront is live with updated items.</span>
        </div>
      )}

      {/* Main Form & Live Preview Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section Visibility Switches Card */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 sm:p-6 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
              <FontAwesomeIcon icon={faSliders} className="text-[var(--accent)]" />
              <span>Section Visibility &amp; Toggles</span>
            </h3>

            {/* Main Sale Section Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Enable Mega Sale Section</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Show or hide the Seasonal Discount Studio showcase on the home page.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled || false}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--olive)]"></div>
              </label>
            </div>

            {/* Top Navbar Alert Bar Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
              <div>
                <h4 className="text-xs font-bold text-[var(--text)]">Show Top Sale Alert Bar (Under Navbar)</h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Display the countdown ticker ticker right at the top under the navbar.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showTopBar || false}
                  onChange={(e) => handleChange('showTopBar', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--olive)]"></div>
              </label>
            </div>
          </div>

          {/* Banner Details & End Timer */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
              <FontAwesomeIcon icon={faTag} className="text-[var(--accent)]" />
              <span>Banner Content &amp; Countdown Timer</span>
            </h3>

            {/* Title & Calligraphy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Banner Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. Grand Gifting & Hamper Mega Sale"
                  className="input-warm"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Calligraphy Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.calligraphy || ''}
                  onChange={(e) => handleChange('calligraphy', e.target.value)}
                  placeholder="e.g. Exclusive Flash Drop"
                  className="input-warm"
                />
              </div>
            </div>

            {/* Event Tag & Offer Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Top Event Pill Tag
                </label>
                <input
                  type="text"
                  value={formData.tag || ''}
                  onChange={(e) => handleChange('tag', e.target.value)}
                  placeholder="e.g. BIG BILLION SAVINGS • MEGA SALE LIVE"
                  className="input-warm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Discount Offer Text
                </label>
                <input
                  type="text"
                  value={formData.discountOffer || ''}
                  onChange={(e) => handleChange('discountOffer', e.target.value)}
                  placeholder="e.g. UP TO 40% OFF"
                  className="input-warm"
                />
              </div>
            </div>

            {/* End Timer Date & Time Picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Sale End Date &amp; Time (Countdown Target)
                </label>
                <span className="text-[11px] font-semibold text-[var(--maroon)]">
                  ⏱ {calculateRemaining()}
                </span>
              </div>
              <input
                type="datetime-local"
                value={formData.endDate ? formData.endDate.substring(0, 16) : ''}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  handleChange('endDate', d.toISOString());
                }}
                className="input-warm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Banner Description
              </label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the promo discounts, special packages or gifts included..."
                className="input-warm resize-none"
              />
            </div>

            {/* Image URL & File Upload Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Banner Image (URL or Upload)
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => handleChange('image', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="input-warm flex-grow"
                />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--card)] hover:border-[var(--chandanam)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <FontAwesomeIcon icon={faUpload} className="text-xs text-[var(--chandanam)]" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {/* CTA Button Text & Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={formData.ctaText || ''}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="e.g. Explore Deals"
                  className="input-warm"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  CTA Button Destination Page
                </label>
                <input
                  type="text"
                  value={formData.ctaLink || '/deals'}
                  onChange={(e) => handleChange('ctaLink', e.target.value)}
                  placeholder="/deals"
                  className="input-warm"
                />
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SALE PRODUCTS SELECTOR & DISCOUNT CUSTOMIZER */}
          {/* ========================================================================= */}
          <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 sm:p-6 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                  <FontAwesomeIcon icon={faBox} className="text-[var(--maroon)]" />
                  <span>Select Products to Include in Sale</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Only the items checked below will appear in the Mega Sale and Deals page.
                </p>
              </div>

              {/* Selection Summary and Shortcuts */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--maroon)] bg-[var(--maroon-light)] px-3 py-1 rounded-full">
                  {selectedCount} Selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] font-semibold text-[var(--olive)] hover:underline cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:flex-grow">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search products to add to sale..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="input-warm pl-9 text-xs py-2"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
                {categoriesList.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryTab(cat)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedCategoryTab === cat
                        ? 'bg-[var(--text)] text-[var(--bg)]'
                        : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products List with 1-Click Sale Switch & Quick Discount Presets */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = (formData.selectedProductIds || []).includes(p.id);
                const discountPercent = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[var(--card)] border-[var(--chandanam)] shadow-xs ring-1 ring-[var(--chandanam)]/30'
                        : 'bg-[var(--bg-subtle)] border-[var(--border)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || p.image}
                        alt={p.name}
                        className="w-11 h-11 rounded-lg object-cover border border-[var(--border)] shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[var(--text)] truncate max-w-xs">{p.name}</h4>
                          <span className="text-[9.5px] font-semibold text-[var(--accent-secondary)]">{p.category}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[var(--text)]">₹{p.price.toLocaleString()}</span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-[10.5px] text-[var(--text-muted)] line-through">
                              ₹{p.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="text-[9.5px] font-bold text-[#5A7249] bg-[#5A7249]/10 px-1.5 py-0.2 rounded">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Discount Presets & Sale Toggle Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] hidden md:inline">Discount:</span>
                          {[15, 25, 35, 40].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => handleApplyProductDiscount(p, pct)}
                              className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--maroon)] hover:text-[var(--maroon)] transition-colors cursor-pointer"
                              title={`Apply ${pct}% discount`}
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleProductInSale(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[var(--maroon)] text-white shadow-xs'
                            : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--text)]'
                        }`}
                      >
                        <FontAwesomeIcon icon={isSelected ? faCheck : faPlus} className="text-[9px]" />
                        <span>{isSelected ? 'In Sale' : 'Add to Sale'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] rounded-xl">
                  No products matched your search.
                </div>
              )}
            </div>

          </div>

          {/* Submit button bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="gold-btn px-8 py-3.5 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} />
              <span>{saving ? 'Saving Changes...' : 'Save & Publish Sale Banner'}</span>
            </button>
          </div>

        </div>

        {/* Right Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[var(--border)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} className="text-[var(--accent)]" />
                  <span>Live Storefront Preview</span>
                </h3>
                <span className="text-[10px] font-semibold text-[var(--chandanam-dark)] bg-[var(--chandanam-soft)] px-2 py-0.5 rounded">
                  Real-time
                </span>
              </div>

              {/* Selected Products Count Pill */}
              <div className="mb-4 p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text)]">Active Sale Products:</span>
                <span className="font-bold text-[var(--maroon)] bg-white dark:bg-black/40 px-2.5 py-0.5 rounded-full border border-[var(--border)]">
                  {selectedCount} Products
                </span>
              </div>

              {/* Poster Preview Card */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                  Storefront Billboard Card Preview:
                </span>
                
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[var(--border)] aspect-[16/10] bg-[var(--bg-subtle)]">
                  <img
                    src={formData.image || 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur-sm text-[var(--text)] text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {formData.tag || 'SEASONAL SPECIAL'}
                    </span>
                    <span className="bg-[var(--maroon)] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {formData.discountOffer || 'SALE'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                    <span
                      className="text-[#F3B868] block"
                      style={{ fontFamily: "'Great Vibes', cursive", fontSize: '18px' }}
                    >
                      {formData.calligraphy || 'Exclusive Drop'}
                    </span>
                    <h4 className="font-heading text-sm font-bold leading-tight line-clamp-1">
                      {formData.title || 'Sale Title'}
                    </h4>
                    <p className="text-white/80 text-[10px] line-clamp-1">
                      {formData.description || 'Sale description text will appear here...'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
