import { create } from 'zustand';
import { defaultCategories } from '@/src/data/initialData';

export const initialCategories = defaultCategories;

const saveToLocalStorage = (categories) => {
  // Removed localStorage usage as hydration is handled server-side now
};

export const useCategoryStore = create((set, get) => ({
  categories: defaultCategories,
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        set({ categories: data.categories, isLoading: false });
        return;
      }
    } catch (e) {
      console.warn('API fetch failed', e);
    }
    set({ isLoading: false });
  },

  addCategory: async (category) => {
    const newCat = {
      ...category,
      id: `cat-${Date.now()}`,
      slug: category.slug || category.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
      enabled: category.enabled ?? true,
      itemCount: 0,
    };

    set((state) => {
      const updated = [...state.categories, newCat];
      saveToLocalStorage(updated);
      return { categories: updated };
    });

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat),
      });
    } catch (e) {
      console.error('Failed to sync category with API', e);
    }

    return newCat;
  },

  updateCategory: async (id, categoryData) => {
    let updatedCat = null;
    set((state) => {
      const updated = state.categories.map((c) => {
        if (c.id === id || c.slug === id) {
          updatedCat = { ...c, ...categoryData };
          return updatedCat;
        }
        return c;
      });
      saveToLocalStorage(updated);
      return { categories: updated };
    });

    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
    } catch (e) {
      console.error('Failed to sync category update with API', e);
    }

    return updatedCat;
  },

  deleteCategory: async (id) => {
    set((state) => {
      const updated = state.categories.filter((c) => c.id !== id && c.slug !== id);
      saveToLocalStorage(updated);
      return { categories: updated };
    });

    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to sync category deletion with API', e);
    }
  },

  toggleCategoryStatus: async (id) => {
    const c = get().categories.find((item) => item.id === id || item.slug === id);
    if (!c) return;
    return get().updateCategory(id, { enabled: !c.enabled });
  },

  resetCategories: async () => {
    set({ categories: defaultCategories });
  },
}));
