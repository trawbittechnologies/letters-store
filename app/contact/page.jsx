'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function ContactPage() {
  const { settings, getWhatsAppUrl } = useSettingsStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    occasion: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const message = `*${settings.orderMessagePrefix || 'New Order — LETTERS'}*
✦ *STUDIO CONTACT INQUIRY* ✦

Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email || 'N/A'}
Topic: ${form.occasion}

Message:
"${form.message}"`;

    setTimeout(() => {
      window.open(getWhatsAppUrl(message), '_blank');
    }, 400);
  };

  const faqs = [
    {
      q: 'How does WhatsApp ordering work?',
      a: 'Select your preferred gift or build a custom hamper, fill out the delivery details, and click "Order on WhatsApp". Our system creates a saved order record and opens WhatsApp with your prefilled message to finalize delivery with our concierge.',
    },
    {
      q: 'Can I add personal photos to frames or hampers?',
      a: 'Yes. For photo frames and personalized memory boxes, you can send your photos directly to us on WhatsApp after placing the order, and we will print and mount them.',
    },
    {
      q: 'What is the delivery timeline?',
      a: 'Standard orders are dispatched within 24-48 hours. Express same-day or next-day delivery is available for select local regions. We recommend placing custom engagement and wedding hampers 3-5 days in advance.',
    },
    {
      q: 'What payment modes are accepted?',
      a: 'We accept UPI (GPay, PhonePe, Paytm), Bank Transfers, and Cash on Delivery for select verified delivery pin codes.',
    },
  ];

  return (
    <div className="min-h-screen pt-8 pb-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-left max-w-3xl mb-16 pb-6 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--card)] border border-[var(--border-dark)] text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--text)] mb-3">
            <MessageCircle size={11} />
            Studio Concierge
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text)] leading-tight tracking-tight mb-3">
            Get in Touch with {settings.brandName}
          </h1>
          <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
            Have questions about custom hampers, event gifting, or order status? We are always here to assist you warmly.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-24">
          
          {/* Left Column: Direct Info Cards - Square */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--card)] border border-[var(--border-dark)] p-6 sm:p-8 space-y-6">
              <h3 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider pb-3 border-b border-[var(--border)]">Studio Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-[var(--accent-hover)] mt-0.5">
                    <Phone size={15} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Call / WhatsApp</h4>
                    <p className="text-xs font-bold text-[var(--text)]">{settings.phoneNumber}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">9:00 AM - 9:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-[var(--accent-hover)] mt-0.5">
                    <Mail size={15} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Email Us</h4>
                    <p className="text-xs font-bold text-[var(--text)]">{settings.email}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 text-[var(--accent-hover)] mt-0.5">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Studio Location</h4>
                    <p className="text-xs font-bold text-[var(--text)]">{settings.address}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">Kerala, India</p>
                  </div>
                </div>
              </div>

              {/* Fast-track WhatsApp Button */}
              <div className="pt-4 border-t border-[var(--border)]">
                <button
                  onClick={() => window.open(getWhatsAppUrl(`Hello ${settings.brandName}, I would like to inquire about placing a gift order!`), '_blank')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-[10.5px] font-bold uppercase tracking-[0.2em] bg-[#25D366] text-white hover:bg-[#1EBE5D] border border-[#25D366] transition-colors cursor-pointer"
                >
                  <MessageCircle size={15} className="fill-current" /> Instant WhatsApp Chat
                </button>
              </div>
            </div>

            {/* Operating Hours Note */}
            <div className="p-5 bg-[var(--card)] border border-[var(--border)] flex items-center gap-3">
              <Clock size={18} className="text-[var(--accent-secondary)] flex-shrink-0" />
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Operating 7 days a week for festive and wedding seasons. Orders accepted online 24/7.
              </p>
            </div>
          </div>

          {/* Right Column: Inquiry Form - Square Flat */}
          <div className="lg:col-span-7 bg-[var(--card)] border border-[var(--border-dark)] p-6 sm:p-8">
            <h3 className="font-heading text-xl font-bold text-[var(--text)] uppercase tracking-wider mb-1">Send an Inquiry</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
              Fill out your requirements below and we will automatically open WhatsApp with your pre-formatted note.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="youremail@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                    Occasion / Requirement
                  </label>
                  <select
                    value={form.occasion}
                    onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)] cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Engagement Hamper">Custom Engagement Hamper</option>
                    <option value="Wedding Bulk Favors">Wedding Bulk Favors</option>
                    <option value="Birthday Surprise Box">Birthday Surprise Box</option>
                    <option value="Corporate Gifting">Corporate Gifting</option>
                    <option value="Flower / Chocolate Bouquet">Flower / Chocolate Bouquet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text)] uppercase tracking-wider mb-1">
                  Message / Custom Requirements *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the gift you have in mind, required delivery date, recipient details..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--border-dark)]"
                />
              </div>

              <button
                type="submit"
                className="w-full gold-btn py-4 px-6 text-[10.5px] font-bold uppercase tracking-[0.2em]"
              >
                <Send size={14} className="mr-2" /> Send via WhatsApp
              </button>

              {submitted && (
                <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-300">
                  <CheckCircle2 size={15} /> Opening WhatsApp with your inquiry...
                </div>
              )}
            </form>
          </div>

        </div>

        {/* FAQs - Square Flat Grid */}
        <div className="bg-[var(--card)] border border-[var(--border-dark)] p-8 sm:p-12">
          <div className="flex items-center gap-2 mb-2 pb-3 border-b border-[var(--border)]">
            <HelpCircle size={16} className="text-[var(--accent)]" />
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[var(--text)] uppercase tracking-wider">Frequently Asked Questions</h3>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-8">Everything you need to know about our gifting process</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 bg-[var(--bg)] border border-[var(--border)]">
                <h4 className="font-heading font-bold text-sm text-[var(--text)] mb-2 uppercase tracking-wider">{faq.q}</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
