'use client';

import { useRef } from 'react';
import { useCategoryStore } from '@/src/store/categoryStore';
import { useProductStore } from '@/src/store/productStore';
import { useSettingsStore } from '@/src/store/settingsStore';
import { useSaleBannerStore } from '@/src/store/saleBannerStore';
import { useFestivalStore, evaluateShowcaseFestival } from '@/src/store/festivalStore';

/**
 * StoreInitializer — runs once during hydration to pre-populate all Zustand
 * stores with server-fetched data. This means every client component that
 * reads from these stores gets real data on the very first render, with no
 * subsequent API requests needed.
 *
 * The `initialized` ref guard prevents double-initialization in React
 * StrictMode and across re-renders.
 */
export default function StoreInitializer({
  categories = [],
  products = [],
  settings = null,
  saleBanner = null,
  festivals = [],
  showcaseFestival = null,
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    initialized.current = true;

    // Hydrate category store
    useCategoryStore.setState({ categories, isLoading: false });

    // Hydrate product store
    if (products.length > 0) {
      useProductStore.setState({ products, isLoading: false });
    }

    // Hydrate settings store
    if (settings) {
      useSettingsStore.setState({ settings, isLoaded: true });
    }

    // Hydrate sale banner store
    if (saleBanner) {
      useSaleBannerStore.setState({ saleBanner, isLoaded: true });
    }

    // Hydrate festival store
    if (festivals.length > 0 || showcaseFestival !== null) {
      const resolved = showcaseFestival ?? evaluateShowcaseFestival(festivals);
      useFestivalStore.setState({
        festivals,
        showcaseFestival: resolved,
        isLoaded: true,
      });
    }
  }

  return null;
}
