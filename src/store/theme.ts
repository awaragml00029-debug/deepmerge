import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define 5 theme colors
export const THEMES = {
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#2563eb',
    color: '#3b82f6', // For color picker display
  },
  green: {
    id: 'green',
    name: 'Forest Green',
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#059669',
    color: '#10b981',
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#7c3aed',
    color: '#8b5cf6',
  },
  orange: {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#ea580c',
    color: '#f97316',
  },
  pink: {
    id: 'pink',
    name: 'Cherry Pink',
    primary: '#ec4899',
    secondary: '#f472b6',
    accent: '#db2777',
    color: '#ec4899',
  },
} as const;

export type ThemeId = keyof typeof THEMES;

interface ThemeStore {
  currentTheme: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  setRandomTheme: () => void;
  applyTheme: (themeId: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'blue' as ThemeId,

      setTheme: (themeId: ThemeId) => {
        set({ currentTheme: themeId });
        get().applyTheme(themeId);
      },

      setRandomTheme: () => {
        const themeIds = Object.keys(THEMES) as ThemeId[];
        const randomId = themeIds[Math.floor(Math.random() * themeIds.length)];
        get().setTheme(randomId);
      },

      applyTheme: (themeId: ThemeId) => {
        const theme = THEMES[themeId];
        const root = document.documentElement;

        // Apply CSS variables
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent);

        // Also set data attribute for CSS selectors
        root.setAttribute('data-theme', themeId);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme on page load
        if (state) {
          state.applyTheme(state.currentTheme);
        }
      },
    }
  )
);
