/**
 * Smart Teknik design tokens.
 * Mirrors docs/html-theme.css and adds a complementary light palette so
 * the same components work in both modes.
 */

export type ThemeMode = "dark" | "light";

export interface ThemeColors {
  // brand
  brand: string;
  brandLight: string;
  brandDark: string;
  brandGlow: string;
  brandOnBrand: string;

  // surfaces
  bg: string;
  bgGradientTop: string;
  bgGradientBottom: string;
  surface: string;
  surfaceRaised: string;
  surfaceMuted: string;
  overlayScrim: string;

  // glass / overlay
  glassTint: "dark" | "light" | "default";
  glassBg: string;
  glassBorder: string;
  glassHighlight: string;

  // text
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;

  // borders
  border: string;
  borderStrong: string;
  borderBrand: string;

  // semantic
  success: string;
  warning: string;
  danger: string;
  info: string;

  // category accents (used for category cards)
  cat1: string; // Projekt
  cat2: string; // Roller & Ledning
  cat3: string; // Projektering
  cat4: string; // Installation
  cat5: string; // Rack & El
  cat6: string; // Nätverk & Kabel
  cat7: string; // Överlämning
  cat1Bg: string;
  cat2Bg: string;
  cat3Bg: string;
  cat4Bg: string;
  cat5Bg: string;
  cat6Bg: string;
  cat7Bg: string;
}

export const darkColors: ThemeColors = {
  brand: "#feba17",
  brandLight: "#fef7e6",
  brandDark: "#99720f",
  brandGlow: "rgba(254, 186, 23, 0.15)",
  brandOnBrand: "#1a1100",

  bg: "#0a0a0c",
  bgGradientTop: "#0e0e12",
  bgGradientBottom: "#050507",
  surface: "#141417",
  surfaceRaised: "#1c1c20",
  surfaceMuted: "#101013",
  overlayScrim: "rgba(0,0,0,0.55)",

  glassTint: "dark",
  glassBg: "rgba(20, 20, 24, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.08)",
  glassHighlight: "rgba(255, 255, 255, 0.04)",

  text: "#f5f5f5",
  textMuted: "#b0b0b0",
  textSubtle: "#888888",
  textInverse: "#0b0b0b",

  border: "rgba(255, 255, 255, 0.1)",
  borderStrong: "rgba(255, 255, 255, 0.16)",
  borderBrand: "rgba(254, 186, 23, 0.35)",

  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#38bdf8",

  cat1: "#feba17",
  cat2: "#a78bfa",
  cat3: "#34d399",
  cat4: "#fb923c",
  cat5: "#60a5fa",
  cat6: "#f472b6",
  cat7: "#facc15",
  cat1Bg: "rgba(254, 186, 23, 0.10)",
  cat2Bg: "rgba(167, 139, 250, 0.10)",
  cat3Bg: "rgba(52, 211, 153, 0.10)",
  cat4Bg: "rgba(251, 146, 60, 0.10)",
  cat5Bg: "rgba(96, 165, 250, 0.10)",
  cat6Bg: "rgba(244, 114, 182, 0.10)",
  cat7Bg: "rgba(250, 204, 21, 0.10)",
};

export const lightColors: ThemeColors = {
  brand: "#dc7403",
  brandLight: "#fff4d6",
  brandDark: "#99720f",
  brandGlow: "rgba(254, 186, 23, 0.16)",
  brandOnBrand: "#1a1100",

  bg: "#f7f5ef",
  bgGradientTop: "#fbfaf5",
  bgGradientBottom: "#efece3",
  surface: "#ffffff",
  surfaceRaised: "#ffffff",
  surfaceMuted: "#f1ede3",
  overlayScrim: "rgba(0,0,0,0.35)",

  glassTint: "light",
  glassBg: "rgba(255, 255, 255, 0.70)",
  glassBorder: "rgba(0, 0, 0, 0.06)",
  glassHighlight: "rgba(255, 255, 255, 0.55)",

  text: "#0b0b0b",
  textMuted: "#4d4d4d",
  textSubtle: "#7a7a7a",
  textInverse: "#ffffff",

  border: "rgba(0, 0, 0, 0.08)",
  borderStrong: "rgba(0, 0, 0, 0.14)",
  borderBrand: "rgba(248, 155, 8, 0.45)",

  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0284c7",

  cat1: "#dc7403",
  cat2: "#7c3aed",
  cat3: "#059669",
  cat4: "#ea580c",
  cat5: "#2563eb",
  cat6: "#db2777",
  cat7: "#ca8a04",
  cat1Bg: "rgba(220, 116, 3, 0.10)",
  cat2Bg: "rgba(124, 58, 237, 0.10)",
  cat3Bg: "rgba(5, 150, 105, 0.10)",
  cat4Bg: "rgba(234, 88, 12, 0.10)",
  cat5Bg: "rgba(37, 99, 235, 0.10)",
  cat6Bg: "rgba(219, 39, 119, 0.10)",
  cat7Bg: "rgba(202, 138, 4, 0.10)",
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  // Mirrors Montserrat/Lato/JetBrains from the theme; map to Jakarta as the
  // app has Jakarta loaded. Use Jakarta everywhere; mono uses system mono.
  heading: "Jakarta-Bold",
  headingSemi: "Jakarta-SemiBold",
  body: "Jakarta",
  bodyMedium: "Jakarta-Medium",
  bodyBold: "Jakarta-Bold",
  mono: undefined as string | undefined, // fall back to system mono
};

export const getColors = (mode: ThemeMode): ThemeColors =>
  mode === "dark" ? darkColors : lightColors;
