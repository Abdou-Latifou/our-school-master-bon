import { useState, useEffect, useCallback } from "react";

export interface AppearanceSettings {
  theme: "light" | "dark" | "auto";
  primaryColor: string;
  compactMode: boolean;
  animations: boolean;
}

const PRIMARY_COLORS: Record<string, { hsl: string; name: string }> = {
  blue: { hsl: "221 83% 53%", name: "Bleu" },
  green: { hsl: "142 76% 36%", name: "Vert" },
  purple: { hsl: "262 83% 58%", name: "Violet" },
  orange: { hsl: "24 95% 53%", name: "Orange" },
  red: { hsl: "0 84% 60%", name: "Rouge" },
};

const DEFAULT_SETTINGS: AppearanceSettings = {
  theme: "light",
  primaryColor: "blue",
  compactMode: false,
  animations: true,
};

export const useTheme = () => {
  const [settings, setSettings] = useState<AppearanceSettings>(() => {
    const saved = localStorage.getItem("appearanceSettings");
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Apply theme to document
  const applyTheme = useCallback((theme: "light" | "dark" | "auto") => {
    const root = document.documentElement;
    
    if (theme === "auto") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  }, []);

  // Apply primary color
  const applyPrimaryColor = useCallback((colorKey: string) => {
    const color = PRIMARY_COLORS[colorKey];
    if (color) {
      document.documentElement.style.setProperty("--primary", color.hsl);
      document.documentElement.style.setProperty("--ring", color.hsl);
      document.documentElement.style.setProperty("--sidebar-primary", color.hsl);
      document.documentElement.style.setProperty("--sidebar-ring", color.hsl);
    }
  }, []);

  // Apply compact mode
  const applyCompactMode = useCallback((enabled: boolean) => {
    document.documentElement.classList.toggle("compact-mode", enabled);
  }, []);

  // Apply animations
  const applyAnimations = useCallback((enabled: boolean) => {
    document.documentElement.classList.toggle("no-animations", !enabled);
  }, []);

  // Initialize on mount
  useEffect(() => {
    applyTheme(settings.theme);
    applyPrimaryColor(settings.primaryColor);
    applyCompactMode(settings.compactMode);
    applyAnimations(settings.animations);
  }, []);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (settings.theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [settings.theme]);

  const updateSettings = useCallback((newSettings: Partial<AppearanceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("appearanceSettings", JSON.stringify(updated));

      // Apply changes immediately
      if (newSettings.theme !== undefined) {
        applyTheme(newSettings.theme);
      }
      if (newSettings.primaryColor !== undefined) {
        applyPrimaryColor(newSettings.primaryColor);
      }
      if (newSettings.compactMode !== undefined) {
        applyCompactMode(newSettings.compactMode);
      }
      if (newSettings.animations !== undefined) {
        applyAnimations(newSettings.animations);
      }

      return updated;
    });
  }, [applyTheme, applyPrimaryColor, applyCompactMode, applyAnimations]);

  return {
    settings,
    updateSettings,
    primaryColors: PRIMARY_COLORS,
  };
};

export default useTheme;
