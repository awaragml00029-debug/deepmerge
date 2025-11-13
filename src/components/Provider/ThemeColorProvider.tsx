"use client";
import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

/**
 * ThemeColorProvider ensures that the user's selected color theme
 * is applied on initial page load and whenever it changes.
 */
export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme, applyTheme } = useThemeStore();

  // Apply theme on mount and when currentTheme changes
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  return <>{children}</>;
}
