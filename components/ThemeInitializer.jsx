'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/src/store/themeStore';
import { useCartStore } from '@/src/store/cartStore';
import { useAuthStore } from '@/src/store/authStore';

/**
 * ThemeInitializer — runs client-side effects that cannot be done server-side:
 *  - initTheme: reads user's saved theme preference from localStorage
 *  - initCart: restores cart contents from localStorage
 *  - initAuth: checks session storage for admin authentication state
 *
 * NOTE: fetchSettings, fetchProducts, and fetchCategories have been intentionally
 * removed here. Those are now server-side hydrated via StoreInitializer (in layout.jsx)
 * using getCachedProducts / getCachedCategories / getCachedSettings, which run
 * during SSR and pre-populate Zustand stores before any client component renders.
 * Calling them again here would create a duplicate waterfall of API requests.
 */
export default function ThemeInitializer() {
  const { initTheme } = useThemeStore();
  const { initCart } = useCartStore();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
    initCart();
    initAuth();
  }, [initTheme, initCart, initAuth]);

  return null;
}
