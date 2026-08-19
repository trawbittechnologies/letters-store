'use client';

import { useState } from 'react';
import { Sparkles, Check, MessageCircle, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/src/store/cartStore';
import { useSettingsStore } from '@/src/store/settingsStore';

const hamperBases = [
  { id: 'box-1', name: 'Handcrafted Wooden Partition Trunk', price: 599, desc: 'Polished pinewood box with brass latch', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80' },
  { id: 'box-2', name: 'Royal Velvet Keepsake Box', price: 699, desc: 'Luxe emerald & gold embossed keepsake box', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80' },
  { id: 'box-3', name: 'Classic Ivory Hamper Basket', price: 399, desc: 'Eco-friendly handwoven willow basket', image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=600&q=80' },
];

const availableItems = [
  { id: 'item-1', name: 'Belgian Truffles & Chocolates (Box of 8)', price: 450, category: 'Chocolates' },
  { id: 'item-2', name: 'Ferrero Rocher Cluster (6 Pcs)', price: 320, category: 'Chocolates' },
  { id: 'item-3', name: 'Preserved Mini Rose Floral Stem', price: 299, category: 'Flowers' },
  { id: 'item-4', name: 'Fresh Seasonal Flower Bouquet Mini', price: 499, category: 'Flowers' },
  { id: 'item-5', name: 'California Roasted Almonds Jar (150g)', price: 380, category: 'Dry Fruits' },
  { id: 'item-6', name: 'Organic Iranian Pistachios Jar (150g)', price: 420, category: 'Dry Fruits' },
  { id: 'item-7', name: 'Minimalist Brass Photo Frame (with Print)', price: 450, category: 'Keepsakes' },
  { id: 'item-8', name: 'Soy Wax Botanical Candle (Vanilla & Rose)', price: 350, category: 'Lifestyle' },
  { id: 'item-9', name: 'Concentrated Non-Alcoholic Oud Attar', price: 400, category: 'Spiritual' },
  { id: 'item-10', name: 'Crystal Tasbeeh Prayer Beads', price: 350, category: 'Spiritual' },
];

export default function CustomGiftPage() {
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const [selectedBase, setSelectedBase] = useState(hamperBases[0]);
  const [selectedItems, setSelectedItems] = useState([availableItems[0], availableItems[2]]);
  const [recipientName, setRecipientName] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [messageCard, setMessageCard] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const toggleItem = (item) => {
    if (selectedItems.find((i) => i.id === item.id)) {
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const calculateTotal = () => {
    const itemsTotal = selectedItems.reduce((sum, item) => sum + item.price, 0);
    return (selectedBase?.price || 0) + itemsTotal;
  };

  const totalAmount = calculateTotal();

  const handleAddToCart = () => {
    const customProduct = {
      id: `custom-hamper-${selectedBase.id}-${selectedItems.map((i) => i.id).join('-')}`,
      name: `Custom Curated Gift Hamper (${selectedBase.name})`,
      slug: 'custom-gift-hamper',
      price: totalAmount,
      image: selectedBase.image,
      category: 'Customized Gift',
    };

    const itemsSummary = selectedItems.map((i) => i.name).join(', ');
    const customization = {
      recipientName,
      occasion,
      personalizedMessage: messageCard,
      specialInstructions: `Base: ${selectedBase.name} | Items: ${itemsSummary} | Notes: ${specialNotes}`,
    };

    addToCart(customProduct, 1, customization);
    router.push('/cart');
  };

  const handleWhatsAppOrder = () => {
    const itemsList = selectedItems.map((i, idx) => `  ${idx + 1}. ${i.name} (₹${i.price})`).join('\n');

    const message = `*${settings.orderMessagePrefix || 'New Order — LETTERS'}*
✦ *CUSTOM GIFT HAMPER INQUIRY* ✦

*Base Packaging:*
• ${selectedBase.name} (₹${selectedBase.price})

*Selected Items:*
${itemsList || '  None'}

*Occasion:* ${occasion}
*Recipient Name:* ${recipientName || 'Not specified'}

*Message for Card:*
"${messageCard || 'None'}"

*Special Notes / Requests:*
${specialNotes || 'None'}

*Calculated Total:* ₹${totalAmount}

Please review my custom configuration and confirm delivery timeline.`;

    window.open(getWhatsAppUrl(message), '_blank');
  };

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-12 pb-6 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--card)] border border-[var(--border-dark)] text-[9px] font-bold tracking-[0.25em] uppercase mb-3 text-[var(--text)]">
            <Sparkles size={11} className="text-[var(--accent)]" />
            Bespoke Custom Studio
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] leading-tight tracking-tight mb-3">
            Build Your Custom Gift
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
            Craft a one-of-a-kind hamper tailored to your recipient. Pick the packaging, curate the contents, write your message, and order via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Configurator Steps - Square Flat Boxes */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Base Selection */}
            <div className="bg-[var(--card)] border border-[var(--border-dark)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                <span className="w-6 h-6 bg-[var(--text)] text-[var(--bg)] text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider">
                  Select Hamper Packaging
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {hamperBases.map((base) => (
                  <div
                    key={base.id}
                    onClick={() => setSelectedBase(base)}
                    className={`cursor-pointer p-4 border transition-colors flex flex-col justify-between ${
                      selectedBase.id === base.id
                        ? 'border-[var(--text)] bg-[var(--bg-subtle)]'
                        : 'border-[var(--border)] hover:border-[var(--border-dark)] bg-[var(--card)]'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden mb-3 bg-[var(--bg)] border border-[var(--border)]">
                      <img src={base.image} alt={base.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-[var(--text)] mb-1">{base.name}</h4>
                      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed mb-3">{base.desc}</p>
                      <span className="text-xs font-bold text-[var(--accent-hover)] font-heading">₹{base.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Curate Items */}
            <div className="bg-[var(--card)] border border-[var(--border-dark)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                <span className="w-6 h-6 bg-[var(--text)] text-[var(--bg)] text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider">
                  Curate Items & Keepsakes ({selectedItems.length} Selected)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableItems.map((item) => {
                  const isSelected = !!selectedItems.find((i) => i.id === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item)}
                      className={`cursor-pointer p-3.5 border transition-colors flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-[var(--text)] bg-[var(--bg-subtle)]'
                          : 'border-[var(--border)] hover:border-[var(--border-dark)] bg-[var(--card)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-[var(--text)] border-[var(--text)] text-[var(--bg)]'
                              : 'border-[var(--border-dark)]'
                          }`}
                        >
                          {isSelected && <Check size={11} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[var(--text)]">{item.name}</p>
                          <span className="text-[9px] text-[var(--accent-secondary)] uppercase tracking-wider font-bold">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[var(--text)] whitespace-nowrap">₹{item.price}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Personalization */}
            <div className="bg-[var(--card)] border border-[var(--border-dark)] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-2 pb-4 border-b border-[var(--border)]">
                <span className="w-6 h-6 bg-[var(--text)] text-[var(--bg)] text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h2 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider">
                  Personalization Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maria / Sister / Dr. John"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Occasion
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)] cursor-pointer"
                  >
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Engagement">Engagement / Wedding</option>
                    <option value="Festival">Festive Celebration</option>
                    <option value="Islamic Celebration">Islamic Celebration / Eid</option>
                    <option value="Congratulations">Congratulations</option>
                    <option value="Thank You">Thank You</option>
                    <option value="Just Because">Just Because</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                  Heartfelt Card Message
                </label>
                <textarea
                  rows={3}
                  placeholder="Write the message you want us to handwrite on the gold-foil greeting card..."
                  value={messageCard}
                  onChange={(e) => setMessageCard(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                  Special Notes / Custom Requirements
                </label>
                <input
                  type="text"
                  placeholder="Any specific requests? (e.g. ribbon color preference, eggless items)"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                />
              </div>
            </div>

          </div>

          {/* Right: Live Summary Sticky Box - Square Flat */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-[var(--card)] border border-[var(--border-dark)] p-6 space-y-6">
              
              <div className="border-b border-[var(--border)] pb-3">
                <h3 className="font-heading text-lg font-bold text-[var(--text)] uppercase tracking-wider">Hamper Summary</h3>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Live pricing breakdown</p>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[var(--text)]">
                  <span className="font-semibold truncate max-w-[180px]">{selectedBase.name}</span>
                  <span className="font-bold">₹{selectedBase.price}</span>
                </div>

                {selectedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[var(--text-muted)] text-[11px]">
                    <span className="truncate max-w-[180px]">/ {item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}

                {selectedItems.length === 0 && (
                  <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold">No items selected yet</p>
                )}
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-[var(--border)] flex justify-between items-baseline">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">Total</span>
                <span className="font-heading text-2xl font-bold text-[var(--text)]">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-[10.5px] font-bold uppercase tracking-[0.2em] bg-[#25D366] text-white hover:bg-[#1EBE5D] border border-[#25D366] transition-colors cursor-pointer"
                >
                  <MessageCircle size={15} className="fill-current" /> Order on WhatsApp
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full gold-btn py-3.5 px-4 text-[10.5px] font-bold uppercase tracking-[0.2em]"
                >
                  <ShoppingBag size={14} className="mr-2" /> Add to Cart
                </button>
              </div>

              <p className="text-[9.5px] text-center text-[var(--text-muted)] uppercase tracking-wider pt-2 border-t border-[var(--border)]">
                Our curator will confirm final dispatch details over WhatsApp.
              </p>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
