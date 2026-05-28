import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, ColorSchemeName } from "react-native";

import {
  ThemeMode,
  ThemeColors,
  getColors,
  radii,
  spacing,
  typography,
} from "./theme";

type AppearancePref = "system" | "dark" | "light";

interface ThemeContextValue {
  mode: ThemeMode;
  appearance: AppearancePref;
  colors: ThemeColors;
  radii: typeof radii;
  spacing: typeof spacing;
  typography: typeof typography;
  setAppearance: (pref: AppearancePref) => Promise<void>;
  toggle: () => Promise<void>;
}

const STORAGE_KEY = "smart_teknik_appearance_pref";

const defaultValue: ThemeContextValue = {
  mode: "dark",
  appearance: "system",
  colors: getColors("dark"),
  radii,
  spacing,
  typography,
  setAppearance: async () => {},
  toggle: async () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultValue);

const resolveMode = (
  appearance: AppearancePref,
  system: ColorSchemeName
): ThemeMode => {
  if (appearance === "system") {
    return system === "light" ? "light" : "dark";
  }
  return appearance;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appearance, setAppearancePref] = useState<AppearancePref>("dark");
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  useEffect(() => {
    (async () => {
      try {
        const stored = (await AsyncStorage.getItem(
          STORAGE_KEY
        )) as AppearancePref | null;
        if (stored === "system" || stored === "dark" || stored === "light") {
          setAppearancePref(stored);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const setAppearance = useCallback(async (pref: AppearancePref) => {
    setAppearancePref(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch {}
  }, []);

  const mode = resolveMode(appearance, systemScheme);

  const toggle = useCallback(async () => {
    const next: AppearancePref = mode === "dark" ? "light" : "dark";
    await setAppearance(next);
  }, [mode, setAppearance]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      appearance,
      colors: getColors(mode),
      radii,
      spacing,
      typography,
      setAppearance,
      toggle,
    }),
    [mode, appearance, setAppearance, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
