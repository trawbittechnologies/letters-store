'use client';

import { useState } from 'react';
import { Save, RefreshCw, CheckCircle2, MessageCircle, Globe, Store } from 'lucide-react';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = async () => {
    if (window.confirm('Reset all business and WhatsApp settings to default LETTERS configuration?')) {
      await resetSettings();
      setForm(useSettingsStore.getState().settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--text)]">Admin Settings</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Configure business contact numbers, WhatsApp ordering gateway, and storefront branding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="outline-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw size={13} /> Reset Defaults
          </button>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 size={16} /> Settings saved and synced successfully across the application!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Business Information */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Store size={18} className="text-[var(--accent)]" />
            <h2 className="font-heading text-xl font-bold text-[var(--text)]">
              Business & Brand Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                name="brandName"
                value={form.brandName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Established Year *
              </label>
              <input
                type="text"
                required
                name="establishedYear"
                value={form.establishedYear}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Studio Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Physical Studio Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp Ordering Gateway */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <MessageCircle size={18} className="text-[#25D366]" />
            <h2 className="font-heading text-xl font-bold text-[var(--text)]">
              WhatsApp Ordering Gateway
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Primary WhatsApp Number for Ordering (with country code, digits only) *
              </label>
              <input
                type="text"
                required
                name="whatsappNumber"
                placeholder="919497219574"
                value={form.whatsappNumber}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                This number powers all WhatsApp CTAs, product instant orders, checkout redirects, and the floating button.
              </p>
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Default Order Message Prefix
              </label>
              <input
                type="text"
                name="orderMessagePrefix"
                value={form.orderMessagePrefix}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Website Branding & Copy */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
            <Globe size={18} className="text-[var(--accent-secondary)]" />
            <h2 className="font-heading text-xl font-bold text-[var(--text)]">
              Storefront Headlines & Taglines
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Hero Main Heading
              </label>
              <input
                type="text"
                name="heroHeading"
                value={form.heroHeading}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Hero Description
              </label>
              <textarea
                rows={2}
                name="heroDescription"
                value={form.heroDescription}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label className="block font-bold text-[var(--text)] uppercase mb-1">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                name="announcementText"
                value={form.announcementText}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            className="gold-btn flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest shadow-md hover:scale-102 transition-all cursor-pointer"
          >
            <Save size={15} /> Save All Settings
          </button>
        </div>

      </form>

    </div>
  );
}
