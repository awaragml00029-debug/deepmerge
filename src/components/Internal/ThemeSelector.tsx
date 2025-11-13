"use client";
import { useState } from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useThemeStore, THEMES, type ThemeId } from "@/store/theme";
import { cn } from "@/utils/style";

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, setTheme } = useThemeStore();

  const handleThemeClick = (themeId: ThemeId) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Button */}
      <Button
        className="h-8 w-8"
        variant="ghost"
        size="icon"
        title="Choose Theme"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className="h-5 w-5" />
      </Button>

      {/* Theme Picker Popover */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Color Circles */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex gap-3">
              {Object.entries(THEMES).map(([id, theme]) => (
                <button
                  key={id}
                  onClick={() => handleThemeClick(id as ThemeId)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all hover:scale-110",
                    "border-2",
                    currentTheme === id
                      ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-400"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                  style={{ backgroundColor: theme.color }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
