'use client';

import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGift,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faXmark,
  faCircleCheck,
  faCalendarDays,
  faClock,
  faCheck,
  faToggleOn,
  faToggleOff,
  faEye,
  faBoxesStacked,
  faArrowRight,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { useFestivalStore, getFestivalStatus } from '@/src/store/festivalStore';

const festivalPresets = {
  onam: {
    name: 'Onam Celebrations',
    title: 'Thiruvonam Grand Festive Atelier',
    subtitle: 'Celebrations of Kerala & Beyond',
    tagline: 'Handcrafted Nilavilakku, Kasavu keepsakes & traditional delicacies prepared fresh to order.',
    description: 'Celebrate the harvest spirit with our signature hand-curated brassware, Balaramapuram Kasavu borders, and gourmet Payasam delights. Includes complimentary handwritten calligraphy letter and wax-sealed note.',
    calligraphy: 'Tradition & Prosperity',
    badge: 'KERALA FESTIVE DROP',
    banner: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=1200&q=85',
    startDate: '2026-08-15',
    endDate: '2026-09-10',
    preBookingEnabled: true,
    preBookingStartDate: '2026-07-15',
    status: 'published',
    announcement: '✨ Pan-India Express Delivery • Live WhatsApp Photo Approval Before Dispatch',
    highlightTag1: 'Authentic Mannar Brass Nilavilakku',
    highlightTag2: 'Handloom Kasavu Keepsake',
    highlightTag3: 'Handwritten Calligraphy Card',
  },
  xmas: {
    name: 'Christmas & New Year 2026',
    title: 'Noël Winter Christmas Luxe Atelier',
    subtitle: 'Fort Kochi Colonial Spice & Nostalgia',
    tagline: 'Artisanal aged dark plum cake, Belgian truffles, hot cocoa blend & pinecone candles.',
    description: 'Enchant your loved ones this season with colonial Fort Kochi recipe plum cakes, vintage wax-sealed scrolls, and handcrafted cocoa indulgences.',
    calligraphy: 'Winter Joy & Warmth',
    badge: 'NOËL SEASON DROP',
    banner: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=85',
    startDate: '2026-12-15',
    endDate: '2027-01-05',
    preBookingEnabled: true,
    preBookingStartDate: '2026-11-15',
    status: 'published',
    announcement: '❄️ Express Christmas Dispatch Across India • Free Calligraphy Greeting Scroll',
    highlightTag1: '6-Month Aged Plum Cake',
    highlightTag2: 'Handmade Hot Cocoa Blend',
    highlightTag3: 'Wax-Sealed Christmas Scroll',
  },
  vishu: {
    name: 'Vishu Celebrations 2027',
    title: 'Auspicious Vishu Kani Heritage Atelier',
    subtitle: 'New Beginnings & Golden Light',
    tagline: 'Polished bell-metal Uruli, Kanikkonna charm, California dry fruits & forest honey.',
    description: 'Welcome the prosperous Malayalam New Year with traditional auspicious keepsakes crafted to perfection by Kerala artisans.',
    calligraphy: 'New Beginnings & Light',
    badge: 'VISHU KANI SPECIAL',
    banner: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=1200&q=85',
    startDate: '2027-04-10',
    endDate: '2027-04-20',
    preBookingEnabled: true,
    preBookingStartDate: '2027-03-10',
    status: 'published',
    announcement: '🌸 Auspicious Kani Arrangements • Handcrafted Kerala Bell-Metal',
    highlightTag1: 'Polished Bell-Metal Uruli',
    highlightTag2: 'Golden Kanikkonna Charm',
    highlightTag3: 'Raw Wild Forest Honey',
  },
  bakrid: {
    name: 'Eid & Bakrid Celebrations',
    title: 'Barakah Eid & Bakrid Royal Atelier',
    subtitle: 'Grace, Devotion & Togetherness',
    tagline: 'Madinah Ajwa dates, crystal Tasbeeh, Arabian Baklava & non-alcoholic royal Oud attar.',
    description: 'Celebrate divine blessings with opulent spiritual curations, gold-embossed Dua keepsakes, and artisanal confectioneries.',
    calligraphy: 'Grace & Togetherness',
    badge: 'BARAKAH EDITION',
    banner: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=85',
    startDate: '2027-05-20',
    endDate: '2027-05-30',
    preBookingEnabled: true,
    preBookingStartDate: '2027-04-20',
    status: 'published',
    announcement: '🌙 Barakah Spiritual Gifting • Premium Ajwa Dates & Oud Attar',
    highlightTag1: 'Premium Madinah Ajwa Dates',
    highlightTag2: 'Crystal Tasbeeh & Royal Oud',
    highlightTag3: 'Embossed Dua Card',
  },
  diwali: {
    name: 'Diwali & Deepavali 2026',
    title: 'Deepam Illuminations & Royal Treats Atelier',
    subtitle: 'Festival of Lights & Auspicious Warmth',
    tagline: 'Hand-painted terracotta diyas, artisanal silver-foiled sweets & brass lamps.',
    description: 'Brighten celebrations with bespoke deepam sets, handcrafted dry fruit confections, and personalized gilded greeting scrolls.',
    calligraphy: 'Light & Prosperity',
    badge: 'DIWALI SPECIAL DROP',
    banner: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=85',
    startDate: '2026-10-25',
    endDate: '2026-11-05',
    preBookingEnabled: true,
    preBookingStartDate: '2026-09-25',
    status: 'published',
    announcement: '🪔 Express Pan-India Diwali Dispatch • Free Calligraphy Card',
    highlightTag1: 'Hand-Cast Brass Diya',
    highlightTag2: 'Silver Foil Sweets',
    highlightTag3: 'Gilded Note Card',
  }
};

const initialFestivalForm = {
  name: '',
  title: '',
  subtitle: '',
  tagline: '',
  description: '',
  calligraphy: '',
  badge: 'FESTIVE DROP',
  banner: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  preBookingEnabled: true,
  preBookingStartDate: '',
  status: 'published',
  announcement: '✨ Pan-India Express Delivery • Live Photo Approval Before Dispatch',
  highlightTag1: 'Artisanal Keepsake',
  highlightTag2: 'Handcrafted Treats',
  highlightTag3: 'Calligraphy Card',
};

const initialProductForm = {
  title: '',
  price: '',
  originalPrice: '',
  badge: 'Festive Special',
  image: '',
  description: '',
  highlights: '',
  origin: 'Kerala Craft Guilds',
  active: true,
};

export default function AdminFestivalHampersPage() {
  const {
    festivals,
    showcaseFestival,
    fetchFestivals,
    createFestival,
    updateFestival,
    deleteFestival,
    addProductToFestival,
    updateFestivalProduct,
    deleteFestivalProduct,
    toggleFestivalProduct,
  } = useFestivalStore();

  const [selectedFestivalId, setSelectedFestivalId] = useState(null);
  const [festivalModalOpen, setFestivalModalOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState(null);
  const [festivalForm, setFestivalForm] = useState(initialFestivalForm);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(initialProductForm);

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchFestivals();
  }, [fetchFestivals]);

  // Set default selected festival to showcase festival or first festival
  useEffect(() => {
    if (festivals && festivals.length > 0 && !selectedFestivalId) {
      if (showcaseFestival) {
        setSelectedFestivalId(showcaseFestival.id);
      } else {
        setSelectedFestivalId(festivals[0].id);
      }
    }
  }, [festivals, showcaseFestival, selectedFestivalId]);

  const activeFestivalDetail = useMemo(() => {
    if (!festivals || festivals.length === 0) return null;
    return festivals.find((f) => f.id === selectedFestivalId) || festivals[0];
  }, [festivals, selectedFestivalId]);

  // 1-Click preset applier
  const handleApplyPreset = (presetKey) => {
    const preset = festivalPresets[presetKey];
    if (preset) {
      setFestivalForm((prev) => ({
        ...prev,
        ...preset,
      }));
      setFeedback(`Loaded ${preset.name} preset template!`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  // When start date changes, automatically compute 1 month before for preBookingStartDate (if not explicitly modified)
  const handleStartDateChange = (newStartDate) => {
    const sDate = new Date(newStartDate);
    sDate.setMonth(sDate.getMonth() - 1);
    const autoPreDate = sDate.toISOString().split('T')[0];

    setFestivalForm((prev) => ({
      ...prev,
      startDate: newStartDate,
      preBookingStartDate: prev.preBookingStartDate && prev.preBookingStartDate !== prev.startDate
        ? prev.preBookingStartDate
        : autoPreDate,
    }));
  };

  const handleOpenCreateFestival = () => {
    setEditingFestival(null);
    const today = new Date().toISOString().split('T')[0];
    const sDate = new Date();
    sDate.setMonth(sDate.getMonth() - 1);
    const autoPre = sDate.toISOString().split('T')[0];

    setFestivalForm({
      ...initialFestivalForm,
      startDate: today,
      preBookingStartDate: autoPre,
    });
    setFestivalModalOpen(true);
  };

  const handleOpenEditFestival = (festival) => {
    setEditingFestival(festival);
    setFestivalForm({
      name: festival.name || '',
      title: festival.title || '',
      subtitle: festival.subtitle || '',
      tagline: festival.tagline || '',
      description: festival.description || '',
      calligraphy: festival.calligraphy || '',
      badge: festival.badge || 'FESTIVE DROP',
      banner: festival.banner || '',
      startDate: festival.startDate || '',
      endDate: festival.endDate || '',
      preBookingEnabled: festival.preBookingEnabled !== false,
      preBookingStartDate: festival.preBookingStartDate || festival.startDate,
      status: festival.status || 'published',
      announcement: festival.announcement || '',
      highlightTag1: festival.highlightTag1 || '',
      highlightTag2: festival.highlightTag2 || '',
      highlightTag3: festival.highlightTag3 || '',
    });
    setFestivalModalOpen(true);
  };

  const handleSaveFestival = async (e) => {
    e.preventDefault();
    if (!festivalForm.name || !festivalForm.startDate || !festivalForm.endDate) {
      alert('Please provide Festival Name, Start Date, and End Date.');
      return;
    }
    setSaving(true);
    try {
      if (editingFestival) {
        await updateFestival(editingFestival.id, festivalForm);
        setFeedback(`"${festivalForm.name}" updated successfully!`);
      } else {
        const created = await createFestival(festivalForm);
        if (created) setSelectedFestivalId(created.id);
        setFeedback(`"${festivalForm.name}" created and published!`);
      }
      setFestivalModalOpen(false);
      setTimeout(() => setFeedback(''), 3500);
    } catch (err) {
      console.error(err);
      setFeedback('Error saving festival.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFestival = async (id, name) => {
    if (confirm(`Are you sure you want to delete festival "${name}" and all its assigned products?`)) {
      await deleteFestival(id);
      setFeedback(`Festival "${name}" removed.`);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleToggleFestivalStatus = async (festival) => {
    const nextStatus = festival.status === 'published' ? 'draft' : 'published';
    await updateFestival(festival.id, { status: nextStatus });
    setFeedback(`"${festival.name}" status updated to ${nextStatus.toUpperCase()}.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  // Product CRUD within festival
  const handleOpenAddProduct = () => {
    if (!activeFestivalDetail) return;
    setEditingProduct(null);
    setProductForm({
      title: '',
      price: 1899,
      originalPrice: 2299,
      badge: `${activeFestivalDetail.name} Special`,
      image: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
      description: 'Handcrafted festive hamper with curated keepsakes, brassware and traditional confections.',
      highlights: 'Signature Keepsake, Kerala Treats, Complimentary Handwritten Card',
      origin: 'Kerala Craft Guilds',
      active: true,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title || product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      badge: product.badge || 'Festive Special',
      image: product.image || (product.images && product.images[0]) || '',
      description: product.description || '',
      highlights: Array.isArray(product.highlights) ? product.highlights.join(', ') : product.highlights || '',
      origin: product.origin || 'Kerala Craft Guilds',
      active: product.active !== false,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!activeFestivalDetail || !productForm.title || !productForm.price) {
      alert('Please fill Hamper Title and Price.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price) || 0,
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        highlights: typeof productForm.highlights === 'string'
          ? productForm.highlights.split(',').map((s) => s.trim()).filter(Boolean)
          : productForm.highlights,
      };

      if (editingProduct) {
        await updateFestivalProduct(activeFestivalDetail.id, editingProduct.id, payload);
        setFeedback('Festival hamper product updated!');
      } else {
        await addProductToFestival(activeFestivalDetail.id, payload);
        setFeedback('New hamper added to festival!');
      }
      setProductModalOpen(false);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error(err);
      setFeedback('Error saving festival hamper product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!activeFestivalDetail) return;
    if (confirm('Are you sure you want to remove this product from the festival?')) {
      await deleteFestivalProduct(activeFestivalDetail.id, productId);
      setFeedback('Product removed from festival.');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleToggleProduct = async (productId) => {
    if (!activeFestivalDetail) return;
    await toggleFestivalProduct(activeFestivalDetail.id, productId);
    setFeedback('Product visibility updated!');
    setTimeout(() => setFeedback(''), 2500);
  };

  const renderStatusBadge = (festival) => {
    const status = getFestivalStatus(festival);
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE (LIVE)
          </span>
        );
      case 'PRE_BOOKING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            <FontAwesomeIcon icon={faClock} className="text-[9px]" />
            PRE-BOOKING
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border border-indigo-500/30">
            <FontAwesomeIcon icon={faCalendarDays} className="text-[9px]" />
            UPCOMING
          </span>
        );
      case 'ENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20">
            ENDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            DRAFT
          </span>
        );
    }
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
              Dynamic Celebration &amp; Festival Engine
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Festival Hampers &amp; Pre-Booking Manager
          </h1>
          <p className="text-xs sm:text-[13px] text-[var(--text-muted)] mt-1">
            Manage multiple celebrations, festival banners, pre-booking windows (1 month before start date), and assign dedicated festive products.
          </p>
        </div>

        <button
          onClick={handleOpenCreateFestival}
          className="gold-btn px-5 py-2.5 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          <span>Add New Festival</span>
        </button>
      </div>

      {feedback && (
        <div className="bg-[var(--chandanam-soft)] border border-[var(--chandanam)]/40 text-[var(--text)] p-4 rounded-xl flex items-center gap-3 text-xs font-semibold animate-fadeIn">
          <FontAwesomeIcon icon={faCircleCheck} className="text-base text-[var(--chandanam-dark)]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STOREFRONT LIVE STATUS SUMMARY CARD */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[var(--chandanam)]/15 text-[var(--chandanam)] flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  Storefront Display Priority Resolver
                </span>
              </div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-[var(--text)]">
                {showcaseFestival ? (
                  <>
                    Live on Storefront: <span className="text-[var(--olive)]">{showcaseFestival.name}</span> ({renderStatusBadge(showcaseFestival)})
                  </>
                ) : (
                  <span className="text-[var(--text-muted)]">No Eligible Festival Currently Active (Section Hidden on Public Site)</span>
                )}
              </h2>
            </div>
          </div>

          <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] px-3.5 py-2 rounded-xl border border-[var(--border)] max-w-md">
            <strong>Priority Engine:</strong> Active Festival (1st) &rarr; Upcoming Festival in 1-Mo Pre-Booking Window (2nd) &rarr; Hidden (3rd).
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FESTIVALS LIST & MATRIX TABLE */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-[var(--text)]">
            Configured Festivals in Database ({festivals.length})
          </h2>
          <span className="text-xs text-[var(--text-muted)]">Click any festival to view &amp; manage its assigned products</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {festivals.map((fest) => {
            const isSelected = selectedFestivalId === fest.id;
            const isShowcase = showcaseFestival?.id === fest.id;
            const productCount = (fest.products || []).length;
            const activeProductCount = (fest.products || []).filter((p) => p.active !== false).length;

            return (
              <div
                key={fest.id}
                onClick={() => setSelectedFestivalId(fest.id)}
                className={`rounded-2xl border bg-[var(--card)] p-4 sm:p-5 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-2xs relative ${
                  isSelected
                    ? 'border-[var(--olive)] ring-2 ring-[var(--olive)]/30'
                    : 'border-[var(--border)] hover:border-[var(--chandanam)]'
                }`}
              >
                {/* Showcase indicator */}
                {isShowcase && (
                  <div className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[9.5px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                    ★ LIVE SHOWCASE
                  </div>
                )}

                <div>
                  {/* Top Bar: Name & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-semibold text-[var(--chandanam)] block" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '18px' }}>
                        {fest.calligraphy || 'Celebration'}
                      </span>
                      <h3 className="font-heading text-base font-bold text-[var(--text)] leading-snug">
                        {fest.name}
                      </h3>
                    </div>
                    {renderStatusBadge(fest)}
                  </div>

                  {/* Banner Preview Thumbnail */}
                  <div className="relative aspect-[16/8] rounded-xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border)] mb-3">
                    <img src={fest.banner} alt={fest.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] px-2 py-0.5 rounded backdrop-blur-xs font-medium">
                      {fest.badge || 'FESTIVE DROP'}
                    </div>
                  </div>

                  {/* Date & Pre-booking information */}
                  <div className="space-y-1 text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] p-2.5 rounded-xl border border-[var(--border)]">
                    <div className="flex items-center justify-between">
                      <span>Festival Dates:</span>
                      <strong className="text-[var(--text)]">{fest.startDate} &rarr; {fest.endDate}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pre-Booking:</span>
                      <span className="font-medium text-[var(--text)]">
                        {fest.preBookingEnabled ? `Starts ${fest.preBookingStartDate || '1 mo prior'}` : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border)]/50">
                      <span>Assigned Hampers:</span>
                      <strong className="text-[var(--olive)]">{activeProductCount} active / {productCount} total</strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border)]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditFestival(fest);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text)] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEdit} className="text-[10px]" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFestivalStatus(fest);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        fest.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20'
                          : 'bg-slate-500/10 text-slate-700 dark:text-slate-300 hover:bg-slate-500/20'
                      }`}
                      title="Toggle Published / Draft Status"
                    >
                      {fest.status === 'published' ? 'Published' : 'Draft'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFestival(fest.id, fest.name);
                    }}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs transition-colors cursor-pointer"
                    title="Delete Festival"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PRODUCT MANAGEMENT FOR SELECTED FESTIVAL */}
      {/* ========================================================================= */}
      {activeFestivalDetail && (
        <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faBoxesStacked} className="text-xs text-[var(--chandanam)]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Products Assigned to Celebration
                </span>
              </div>
              <h2 className="font-heading text-xl font-bold text-[var(--text)]">
                {activeFestivalDetail.name} — Product Shelf ({activeFestivalDetail.products?.length || 0} Hampers)
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                These products only display on the storefront when <strong>{activeFestivalDetail.name}</strong> is in its active or pre-booking window.
              </p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="gold-btn px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span>Add Hamper to {activeFestivalDetail.name}</span>
            </button>
          </div>

          {/* Product Items List / Grid */}
          {(!activeFestivalDetail.products || activeFestivalDetail.products.length === 0) ? (
            <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-2xl p-6">
              <FontAwesomeIcon icon={faGift} className="text-3xl text-[var(--text-muted)] mb-3" />
              <h3 className="font-heading text-base font-bold text-[var(--text)]">No Hampers Assigned Yet</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1 mb-4">
                Add products specifically for {activeFestivalDetail.name}. When the festival is active, these products will appear under the banner.
              </p>
              <button
                onClick={handleOpenAddProduct}
                className="gold-btn px-5 py-2 text-xs font-bold uppercase rounded-full cursor-pointer"
              >
                + Add First Hamper Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFestivalDetail.products.map((prod) => {
                const isActive = prod.active !== false;

                return (
                  <div
                    key={prod.id}
                    className={`rounded-2xl border bg-[var(--card)] overflow-hidden transition-all flex flex-col justify-between shadow-2xs ${
                      isActive
                        ? 'border-[var(--border)] hover:border-[var(--chandanam)] hover:shadow-md'
                        : 'opacity-60 border-dashed border-gray-300'
                    }`}
                  >
                    {/* Top Image */}
                    <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)]">
                      <img
                        src={prod.image || (prod.images && prod.images[0]) || 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=600&q=80'}
                        alt={prod.title || prod.name}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {prod.badge && (
                          <span className="bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                            {prod.badge}
                          </span>
                        )}
                      </div>

                      {/* Visibility Toggle Button Overlay */}
                      <button
                        onClick={() => handleToggleProduct(prod.id)}
                        className={`absolute top-3 right-3 text-[10.5px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                        title="Toggle Product Visibility"
                      >
                        {isActive ? '✓ Active' : '✕ Inactive'}
                      </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
                      <div>
                        <h4 className="font-heading text-base font-bold text-[var(--text)] leading-snug line-clamp-1 mb-1">
                          {prod.title || prod.name}
                        </h4>

                        <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                          {prod.description}
                        </p>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 bg-[var(--bg-subtle)] p-2 rounded-xl border border-[var(--border)] mb-2">
                          <span className="font-heading text-base font-bold text-[var(--text)]">
                            ₹{prod.price?.toLocaleString()}
                          </span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="text-xs text-[var(--text-muted)] line-through">
                              ₹{prod.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faEdit} className="text-[11px]" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
                          title="Remove Hamper from Festival"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT FESTIVAL */}
      {/* ========================================================================= */}
      {festivalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 sm:p-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                  {editingFestival ? `Edit Festival: ${editingFestival.name}` : 'Create New Celebration / Festival'}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Configure banner assets, dates, automated 1-month pre-booking, and celebration storytelling.
                </p>
              </div>
              <button
                onClick={() => setFestivalModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text)] flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Quick 1-Click Templates */}
            <div className="mb-6 bg-[var(--bg-subtle)] p-3.5 rounded-2xl border border-[var(--border)]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                Quick 1-Click Festival Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('onam')}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] cursor-pointer"
                >
                  🌼 Onam
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('xmas')}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] cursor-pointer"
                >
                  🎄 Christmas &amp; New Year
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('vishu')}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] cursor-pointer"
                >
                  🌸 Vishu
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('bakrid')}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] cursor-pointer"
                >
                  🌙 Eid &amp; Bakrid
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('diwali')}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--card)] hover:bg-[var(--border)] text-[var(--text)] border border-[var(--border)] cursor-pointer"
                >
                  🪔 Diwali
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveFestival} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Festival / Celebration Name *</label>
                  <input
                    type="text"
                    required
                    value={festivalForm.name}
                    onChange={(e) => setFestivalForm({ ...festivalForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold"
                    placeholder="e.g. Onam Celebrations 2026"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Headline Title</label>
                  <input
                    type="text"
                    value={festivalForm.title}
                    onChange={(e) => setFestivalForm({ ...festivalForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="e.g. Thiruvonam Grand Festive Atelier"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Festival Start Date *</label>
                  <input
                    type="date"
                    required
                    value={festivalForm.startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Festival End Date *</label>
                  <input
                    type="date"
                    required
                    value={festivalForm.endDate}
                    onChange={(e) => setFestivalForm({ ...festivalForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-medium"
                  />
                </div>
              </div>

              {/* Pre-Booking Controls */}
              <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[var(--text)]">Upcoming Pre-Booking System</h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Automatically opens pre-booking 1 month prior to Festival Start Date.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={festivalForm.preBookingEnabled}
                      onChange={(e) => setFestivalForm({ ...festivalForm, preBookingEnabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--olive)]"></div>
                  </label>
                </div>

                {festivalForm.preBookingEnabled && (
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">
                      Pre-Booking Start Date (Default: 1 Month Before Start Date)
                    </label>
                    <input
                      type="date"
                      value={festivalForm.preBookingStartDate}
                      onChange={(e) => setFestivalForm({ ...festivalForm, preBookingStartDate: e.target.value })}
                      className="w-full sm:w-1/2 px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    />
                  </div>
                )}
              </div>

              {/* Banner & Storytelling */}
              <div className="space-y-3">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Banner Image URL *</label>
                  <input
                    type="text"
                    required
                    value={festivalForm.banner}
                    onChange={(e) => setFestivalForm({ ...festivalForm, banner: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">Calligraphy Flourish Line</label>
                    <input
                      type="text"
                      value={festivalForm.calligraphy}
                      onChange={(e) => setFestivalForm({ ...festivalForm, calligraphy: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                      placeholder="e.g. Tradition & Prosperity"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">Top Badge Text</label>
                    <input
                      type="text"
                      value={festivalForm.badge}
                      onChange={(e) => setFestivalForm({ ...festivalForm, badge: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                      placeholder="e.g. KERALA FESTIVE DROP"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Tagline &amp; Short Description</label>
                  <input
                    type="text"
                    value={festivalForm.tagline}
                    onChange={(e) => setFestivalForm({ ...festivalForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] mb-2"
                    placeholder="Short catchy tagline..."
                  />
                  <textarea
                    rows={2}
                    value={festivalForm.description}
                    onChange={(e) => setFestivalForm({ ...festivalForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="Full celebration description..."
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Delivery Announcement Ribbon</label>
                  <input
                    type="text"
                    value={festivalForm.announcement}
                    onChange={(e) => setFestivalForm({ ...festivalForm, announcement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="e.g. ✨ Pan-India Express Delivery..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">Highlight Chip 1</label>
                    <input
                      type="text"
                      value={festivalForm.highlightTag1}
                      onChange={(e) => setFestivalForm({ ...festivalForm, highlightTag1: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">Highlight Chip 2</label>
                    <input
                      type="text"
                      value={festivalForm.highlightTag2}
                      onChange={(e) => setFestivalForm({ ...festivalForm, highlightTag2: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[var(--text)] block mb-1">Highlight Chip 3</label>
                    <input
                      type="text"
                      value={festivalForm.highlightTag3}
                      onChange={(e) => setFestivalForm({ ...festivalForm, highlightTag3: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Publish Status</label>
                  <select
                    value={festivalForm.status}
                    onChange={(e) => setFestivalForm({ ...festivalForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold cursor-pointer"
                  >
                    <option value="published">Published (Active on Eligible Dates)</option>
                    <option value="draft">Draft / Hidden (Never displayed publicly)</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setFestivalModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-subtle)] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="gold-btn px-6 py-2 rounded-full font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  {saving ? 'Saving...' : editingFestival ? 'Update Festival' : 'Create Festival'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT FESTIVAL PRODUCT */}
      {/* ========================================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl p-6 sm:p-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-[var(--text)]">
                  {editingProduct ? 'Edit Festival Hamper' : `Add Hamper to ${activeFestivalDetail?.name}`}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Add product title, pricing, images, and craft inclusions.
                </p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--border)] text-[var(--text)] flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="font-semibold text-[var(--text)] block mb-1">Hamper Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold"
                  placeholder="e.g. Royal Kasavu & Artisanal Treats Hamper"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-semibold"
                    placeholder="1899"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="2299"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--text)] block mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="e.g. Onam Special"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[var(--text)] block mb-1">Origin / Craft Cluster</label>
                  <input
                    type="text"
                    value={productForm.origin}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                    placeholder="e.g. Mannar & Balaramapuram Craft Clusters"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[var(--text)] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                  placeholder="Artisanal description of this celebration hamper..."
                />
              </div>

              <div>
                <label className="font-semibold text-[var(--text)] block mb-1">Inclusions / Highlights (Comma separated)</label>
                <input
                  type="text"
                  value={productForm.highlights}
                  onChange={(e) => setProductForm({ ...productForm, highlights: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]"
                  placeholder="Brass Nilavilakku, Palada Payasam, Banana Chips, Custom Note"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="prodActive"
                  checked={productForm.active}
                  onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[var(--olive)] cursor-pointer"
                />
                <label htmlFor="prodActive" className="font-semibold text-[var(--text)] cursor-pointer">
                  Product Active / Published
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--bg-subtle)] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="gold-btn px-6 py-2 rounded-full font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  {saving ? 'Saving...' : editingProduct ? 'Update Hamper' : 'Add Hamper'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
