import { create } from 'zustand';
import { defaultFestivalHampers } from '@/src/data/initialData';

export const useFestivalStore = create((set, get) => ({
  festivalHampers: defaultFestivalHampers,
  isLoaded: false,

  fetchFestivalHampers: async () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('letters_festival_hampers');
        if (saved) {
          set({ festivalHampers: { ...defaultFestivalHampers, ...JSON.parse(saved) }, isLoaded: true });
        }
      } catch (e) {}
    }

    try {
      const res = await fetch(`/api/festival-hampers?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' },
      });
      const data = await res.json();
      if (data.success && data.festivalHampers) {
        set({ festivalHampers: data.festivalHampers, isLoaded: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('letters_festival_hampers', JSON.stringify(data.festivalHampers));
        }
        return;
      }
    } catch (e) {
      console.warn('Using cached festival hampers', e);
    }
  },

  updateFestivalSection: async (sectionData) => {
    const current = get().festivalHampers;
    const updated = { ...current, ...sectionData };
    set({ festivalHampers: updated, isLoaded: true });

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('letters_festival_hampers', JSON.stringify(updated));
      } catch (e) {}
    }

    try {
      const res = await fetch('/api/festival-hampers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData),
      });
      const data = await res.json();
      if (data.success && data.festivalHampers) {
        set({ festivalHampers: data.festivalHampers, isLoaded: true });
      }
    } catch (e) {
      console.error(e);
    }
  },

  addFestivalHamper: async (itemData) => {
    try {
      const res = await fetch('/api/festival-hampers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (data.success && data.festivalHampers) {
        set({ festivalHampers: data.festivalHampers, isLoaded: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('letters_festival_hampers', JSON.stringify(data.festivalHampers));
        }
        return data.item;
      }
    } catch (e) {
      console.error(e);
    }

    const current = get().festivalHampers;
    const newItem = {
      ...itemData,
      id: `fest-${Date.now()}`,
      enabled: itemData.enabled !== false,
      createdAt: new Date().toISOString(),
    };
    const updated = {
      ...current,
      items: [newItem, ...(current.items || [])],
    };
    set({ festivalHampers: updated, isLoaded: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('letters_festival_hampers', JSON.stringify(updated));
    }
    return newItem;
  },

  updateFestivalHamper: async (id, itemData) => {
    try {
      const res = await fetch('/api/festival-hampers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, itemData }),
      });
      const data = await res.json();
      if (data.success && data.festivalHampers) {
        set({ festivalHampers: data.festivalHampers, isLoaded: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('letters_festival_hampers', JSON.stringify(data.festivalHampers));
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const current = get().festivalHampers;
    const updatedItems = (current.items || []).map((it) => (it.id === id ? { ...it, ...itemData } : it));
    const updated = { ...current, items: updatedItems };
    set({ festivalHampers: updated, isLoaded: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('letters_festival_hampers', JSON.stringify(updated));
    }
  },

  deleteFestivalHamper: async (id) => {
    try {
      const res = await fetch(`/api/festival-hampers?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success && data.festivalHampers) {
        set({ festivalHampers: data.festivalHampers, isLoaded: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('letters_festival_hampers', JSON.stringify(data.festivalHampers));
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const current = get().festivalHampers;
    const updatedItems = (current.items || []).filter((it) => it.id !== id);
    const updated = { ...current, items: updatedItems };
    set({ festivalHampers: updated, isLoaded: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('letters_festival_hampers', JSON.stringify(updated));
    }
  },

  toggleFestivalHamper: async (id) => {
    try {
      const res = await fetch('/api/festival-hampers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', id }),
      });
      const data = await res.json();
      if (data.success && data.festivalHampers) {
        set({ festivalHampers: data.festivalHampers, isLoaded: true });
        if (typeof window !== 'undefined') {
          localStorage.setItem('letters_festival_hampers', JSON.stringify(data.festivalHampers));
        }
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const current = get().festivalHampers;
    const updatedItems = (current.items || []).map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it));
    const updated = { ...current, items: updatedItems };
    set({ festivalHampers: updated, isLoaded: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('letters_festival_hampers', JSON.stringify(updated));
    }
  },
}));
