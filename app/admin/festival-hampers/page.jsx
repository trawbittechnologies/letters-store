'use client';

import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGift,
  faPlus,
  faEdit,
  faTrash,
  faCheck,
  faSave,
  faXmark,
  faEye,
  faSliders,
  faTag,
  faCircleCheck,
  faSparkles,
  faPercent,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';
import { useFestivalStore } from '@/src/store/festivalStore';

const festivalOptions = [
  { id: 'onam', label: '🌼 Onam', name: 'Onam' },
  { id: 'xmas', label: '🎄 Christmas (X-Mas)', name: 'Christmas (X-Mas)' },
  { id: 'vishu', label: '🌸 Vishu', name: 'Vishu' },
  { id: 'bakrid', label: '🌙 Eid & Bakrid', name: 'Eid & Bakrid' },
  { id: 'custom', label: '✨ Other Festival', name: 'Special Celebration' },
];

const discountPresets = [10, 15, 20, 25, 30, 35, 40, 50];

export default function AdminFestivalHampersPage() {
  const {
    festivalHampers,
    fetchFestivalHampers,
    updateFestivalSection,
    addFestivalHamper,
    updateFestivalHamper,
    deleteFestivalHamper,
    toggleFestivalHamper,
  } = useFestivalStore();

  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    festivalType: 'onam',
    festivalName: 'Onam',
    tag: 'ONAM SPECIAL',
    calligraphy: 'Tradition & Prosperity',
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercent: 20,
    showPrice: true,
    badge: 'Onam Special',
    image: '',
    highlights: '',
    enabled: true,
  });

  useEffect(() => {
    fetchFestivalHampers();
  }, [fetchFestivalHampers]);

  const items = festivalHampers?.items || [];

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter((it) => it.festivalType === activeFilter);
  }, [items, activeFilter]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      festivalType: 'onam',
      festivalName: 'Onam',
      tag: 'ONAM SPECIAL',
      calligraphy: 'Tradition & Prosperity',
      title: '',
      description: '',
      price: 1899,
      originalPrice: 2299,
      discountPercent: 17,
      showPrice: true,
      badge: 'Festive Special',
      image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
      highlights: 'Brass Nilavilakku, Palada Payasam, Banana Chips, Custom Note',
      enabled: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    const orig = item.originalPrice || item.price;
    const computedDiscount = orig > item.price ? Math.round(((orig - item.price) / orig) * 100) : 0;

    setFormData({
      festivalType: item.festivalType || 'onam',
      festivalName: item.festivalName || 'Onam',
      tag: item.tag || 'FESTIVE SPECIAL',
      calligraphy: item.calligraphy || 'Artisanal Curations',
      title: item.title || '',
      description: item.description || '',
      price: item.price || '',
      originalPrice: item.originalPrice || '',
      discountPercent: item.discountPercent || computedDiscount,
      showPrice: item.showPrice !== false,
      badge: item.badge || 'Festive Special',
      image: item.image || '',
      highlights: Array.isArray(item.highlights) ? item.highlights.join(', ') : item.highlights || '',
      enabled: item.enabled !== false,
    });
    setModalOpen(true);
  };

  // Apply quick discount % preset
  const handleApplyDiscountPreset = (percent) => {
    const orig = Number(formData.originalPrice) || Number(formData.price) || 2000;
    const newPrice = Math.round(orig * (1 - percent / 100));
    setFormData((prev) => ({
      ...prev,
      originalPrice: orig,
      price: newPrice,
      discountPercent: percent,
    }));
  };

  // When offer price or original price is manually changed, update discount %
  const handlePriceChange = (priceVal, origVal) => {
    const p = Number(priceVal);
    const o = Number(origVal);
    let disc = formData.discountPercent;
    if (o > 0 && p > 0 && o >= p) {
      disc = Math.round(((o - p) / o) * 100);
    }
    setFormData((prev) => ({
      ...prev,
      price: priceVal,
      originalPrice: origVal,
      discountPercent: disc,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        discountPercent: Number(formData.discountPercent) || 0,
        showPrice: formData.showPrice !== false,
        highlights: typeof formData.highlights === 'string'
          ? formData.highlights.split(',').map((s) => s.trim()).filter(Boolean)
          : formData.highlights,
      };

      if (editingItem) {
        await updateFestivalHamper(editingItem.id, payload);
        setFeedback('Festival hamper updated successfully!');
      } else {
        await addFestivalHamper(payload);
        setFeedback('New festival hamper added and published!');
      }
      setModalOpen(false);
      setTimeout(() => setFeedback(''), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this festival hamper?')) {
      await deleteFestivalHamper(id);
      setFeedback('Festival hamper removed.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleToggleActive = async (id) => {
    await toggleFestivalHamper(id);
    setFeedback('Status updated! Public storefront updated in real-time.');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleTogglePriceVisibility = async (item) => {
    const newShowPrice = item.showPrice === false;
    await updateFestivalHamper(item.id, { showPrice: newShowPrice });
    setFeedback(newShowPrice ? 'Price is now VISIBLE on public site.' : 'Price is now HIDDEN (Price On Request).');
    setTimeout(() => setFeedback(''), 2500);
  };

  const handleToggleGlobalSection = async () => {
    const nextState = !festivalHampers.enabled;
    await updateFestivalSection({ enabled: nextState });
    setFeedback(nextState ? 'Festival Hamper Atelier is now LIVE on public site.' : 'Festival Hamper Section is now HIDDEN.');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--olive)] text-white text-xs">
              <FontAwesomeIcon icon={faGift} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
              Seasonal &amp; Cultural Curations
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Festival Hampers Manager
          </h1>
          <p className="text-xs sm:text-[13px] text-[var(--text-muted)] mt-1">
            Control price display ON/OFF, custom discount percentages, and active status for <strong>Onam</strong>, <strong>Christmas</strong>, <strong>Vishu</strong>, and <strong>Eid &amp; Bakrid</strong>.
          </p>
        </div>

        {/* Global Controls & Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleGlobalSection}
            className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
              festivalHampers.enabled
                ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${festivalHampers.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <span>{festivalHampers.enabled ? 'Section: ON (Live)' : 'Section: OFF (Hidden)'}</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="gold-btn px-5 py-2.5 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Festival Hamper</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-[var(--chandanam-soft)] border border-[var(--chandanam)]/40 text-[var(--text)] p-4 rounded-xl flex items-center gap-3 text-xs font-semibold animate-fadeIn">
          <FontAwesomeIcon icon={faCircleCheck} className="text-base text-[var(--chandanam-dark)]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] p-4 rounded-2xl border border-[var(--border)] shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Festivals' },
            { id: 'onam', label: '🌼 Onam' },
            { id: 'xmas', label: '🎄 Christmas (X-Mas)' },
            { id: 'vishu', label: '🌸 Vishu' },
            { id: 'bakrid', label: '🌙 Eid & Bakrid' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[var(--text)] text-[var(--bg)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--bg-subtle)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-[var(--text-muted)] font-medium">
          Showing <strong>{filteredItems.length}</strong> festive curations
        </span>
      </div>

      {/* Hampers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const discountPercent = item.discountPercent || (item.originalPrice
            ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
            : 0);

          const isPriceVisible = item.showPrice !== false;

          return (
            <div
              key={item.id}
              className={`rounded-2xl border bg-[var(--card)] overflow-hidden transition-all flex flex-col justify-between shadow-2xs ${
                item.enabled
                  ? 'border-[var(--border)] hover:border-[var(--chandanam)] hover:shadow-md'
                  : 'opacity-60 border-dashed border-gray-300'
              }`}
            >
              {/* Top Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-subtle)]">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=600&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Festival Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {item.festivalName || item.festivalType}
                  </span>
                  {discountPercent > 0 && (
                    <span className="bg-[#721C28] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Status Toggle Switch Overlay */}
                <button
                  onClick={() => handleToggleActive(item.id)}
                  className={`absolute top-3 right-3 text-[10.5px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer ${
                    item.enabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}
                  title="Click to toggle Public Visibility"
                >
                  {item.enabled ? '✓ Active on Site' : '✕ Hidden from Site'}
                </button>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[var(--chandanam)]"
                      style={{ fontFamily: "'Great Vibes', cursive", fontSize: '18px' }}
                    >
                      {item.calligraphy || 'Artisanal Curation'}
                    </span>

                    {/* Price Visibility Pill Button */}
                    <button
                      onClick={() => handleTogglePriceVisibility(item)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-all ${
                        isPriceVisible
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                      }`}
                      title="Click to switch between Price Shown / Price On Request"
                    >
                      {isPriceVisible ? 'Price: ON' : 'Price: OFF (On Request)'}
                    </button>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[var(--text)] leading-snug mb-1">
                    {item.title}
                  </h3>

                  <p className="text-[var(--text-muted)] text-[11.5px] line-clamp-2 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="flex items-baseline gap-2 pt-2 border-t border-[var(--border)]/60">
                    {isPriceVisible ? (
                      <>
                        <span className="font-heading text-lg font-bold text-[var(--text)]">
                          ₹{item.price?.toLocaleString()}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-[var(--text-muted)] line-through">
                            ₹{item.originalPrice?.toLocaleString()}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[10px] font-bold text-[#5A7249] bg-[#5A7249]/10 px-2 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-bold text-[var(--chandanam-dark)] bg-[var(--chandanam-soft)] px-2.5 py-1 rounded-full">
                        💬 Price On Request / WhatsApp Quote
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border)]/60">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-[var(--bg-subtle)] text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-[10px]" />
                    <span>Edit Hamper</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                    <span>Delete</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT FESTIVAL HAMPER MODAL */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp my-8">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                  {editingItem ? 'Edit Festival Hamper' : 'Add New Festival Hamper'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Configure discount percentage, price visibility ON/OFF, and celebration details.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Festival Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Festival Occasion
                  </label>
                  <select
                    value={formData.festivalType}
                    onChange={(e) => {
                      const sel = festivalOptions.find((o) => o.id === e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        festivalType: e.target.value,
                        festivalName: sel ? sel.name : e.target.value,
                      }));
                    }}
                    className="input-warm"
                    required
                  >
                    {festivalOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Badge / Tag (e.g. Onam Special)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Onam Special, X-Mas Edition"
                    className="input-warm"
                  />
                </div>
              </div>

              {/* Title & Calligraphy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Hamper Title / Name
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Royal Onam Kasavu & Treats Hamper"
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
                    value={formData.calligraphy}
                    onChange={(e) => setFormData((prev) => ({ ...prev, calligraphy: e.target.value }))}
                    placeholder="e.g. Thiruvonam Traditions"
                    className="input-warm"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* PRICE ON/OFF SWITCH & DISCOUNT PERCENTAGE BUILDER */}
              {/* ========================================================================= */}
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-3.5">
                
                {/* Price Display ON/OFF Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]/60">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                      <span>Price Display Switch (ON / OFF)</span>
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {formData.showPrice
                        ? '🟢 Price is VISIBLE on public store'
                        : '🟡 Price is HIDDEN ("Price On Request / WhatsApp for Quote")'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPrice}
                      onChange={(e) => setFormData((prev) => ({ ...prev, showPrice: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--olive)]"></div>
                  </label>
                </div>

                {/* Quick Discount Presets */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                      <FontAwesomeIcon icon={faPercent} className="text-[var(--maroon)] text-[10px]" />
                      <span>Discount Percentage Preset</span>
                    </label>
                    <span className="text-[11px] font-bold text-[var(--maroon)]">
                      {formData.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {discountPresets.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleApplyDiscountPreset(pct)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          formData.discountPercent === pct
                            ? 'bg-[#721C28] text-white shadow-xs'
                            : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)] hover:border-[#721C28]'
                        }`}
                      >
                        {pct}% OFF
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offer Price and Original Price Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Offer / Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handlePriceChange(e.target.value, formData.originalPrice)}
                      placeholder="1899"
                      className="input-warm bg-[var(--card)]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Original Price (₹) (Before Discount)
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handlePriceChange(formData.price, e.target.value)}
                      placeholder="2299"
                      className="input-warm bg-[var(--card)]"
                    />
                  </div>
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Hamper Description &amp; Curated Treats
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Detail the brass Nilavilakku, organic Palada payasam, honey banana chips, sharkara varatti, aroma candle..."
                  className="input-warm resize-none"
                  required
                />
              </div>

              {/* Highlights (Comma separated) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Included Highlights / Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.highlights}
                  onChange={(e) => setFormData((prev) => ({ ...prev, highlights: e.target.value }))}
                  placeholder="Kasavu Border Box, Brass Nilavilakku, Palada Payasam, Banana Chips"
                  className="input-warm"
                />
              </div>

              {/* Image Upload & URL */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Hamper Image (Upload or Enter URL)
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">
                      Upload from Device:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 5 * 1024 * 1024) {
                          alert('Please upload an image smaller than 5MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData((prev) => ({ ...prev, image: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="text-xs text-[var(--text)] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[var(--olive)] file:text-white hover:file:bg-[var(--olive-hover)] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[var(--text-muted)] block mb-1">
                      Or Image URL:
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="input-warm"
                      required
                    />
                  </div>
                </div>

                {formData.image && (
                  <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--border)]">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Public Storefront Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)]">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text)]">Publish on Public Storefront</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    If active, this festive hamper will be displayed in the Festive Hamper section on the public site.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData((prev) => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--olive)]"></div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--bg-subtle)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="gold-btn px-6 py-2.5 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faSave} />
                  <span>{saving ? 'Saving...' : editingItem ? 'Update Hamper' : 'Publish Hamper'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
