'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Gift, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/src/store/authStore';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { settings } = useSettingsStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('letters@2020');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg)] transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 text-[var(--accent-hover)] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Gift size={28} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-[var(--text)] tracking-wider">
            {settings.brandName}
          </h1>
          <p className="text-xs uppercase font-bold tracking-widest text-[var(--accent-secondary)] mt-1">
            Store Management Portal
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text)] uppercase mb-1">
              Username or Admin Email
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text)] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-btn py-3.5 px-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight size={14} />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-muted)] space-y-2">
          <p className="flex items-center justify-center gap-1.5 text-[11px]">
            <ShieldCheck size={14} className="text-[var(--accent)]" /> Protected store owner access
          </p>
          <div>
            <Link href="/" className="text-[11px] font-semibold text-[var(--accent-secondary)] hover:underline">
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
