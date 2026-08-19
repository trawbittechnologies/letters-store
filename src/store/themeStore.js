import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.className = theme;
      try {
        localStorage.setItem('letters_theme', theme);
      } catch (e) {}
    }
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.className = nextTheme;
        try {
          localStorage.setItem('letters_theme', nextTheme);
        } catch (e) {}
      }
      return { theme: nextTheme };
    }),
  initTheme: () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('letters_theme') || 'light';
        document.documentElement.className = saved;
        set({ theme: saved });
      } catch (e) {
        set({ theme: 'light' });
      }
    }
  },
}));
