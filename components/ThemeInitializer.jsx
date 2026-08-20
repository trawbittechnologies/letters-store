'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/src/store/themeStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useCartStore } from '@/src/store/cartStore';
import { useProductStore } from '@/src/store/productStore';
import { useCategoryStore } from '@/src/store/categoryStore';
import { useAuthStore } from '@/src/store/authStore';

export default function ThemeInitializer() {
  const { initTheme } = useThemeStore();
  const { fetchSettings } = useSettingsStore();
  const { initCart } = useCartStore();
  const { fetchProducts } = useProductStore();
  const { fetchCategories } = useCategoryStore();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initTheme();
    initCart();
    fetchSettings();
    fetchProducts();
    initAuth();
  }, [initTheme, initCart, fetchSettings, fetchProducts, initAuth]);

  return null;
}
