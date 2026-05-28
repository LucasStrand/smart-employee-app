import React from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/lib/ThemeContext";

interface TopScrimProps {
  /** Dark mode only: scroll-linked fade strength. Light mode stays fully opaque. */
  scrollFade?: Animated.AnimatedInterpolation<number> | number;
  style?: ViewStyle;
}

/** Convert #rrggbb to rgba() — reliable across iOS/Android gradient rendering. */
export const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  const a = Math.min(1, Math.max(0, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * Fixed top gradient for status-bar legibility on edge-to-edge screens.
 * Light mode: short cream fade under the status bar only.
 * Dark mode: taller bg scrim with scroll-linked intensity.
 */
export const TopScrim: React.FC<TopScrimProps> = ({
  scrollFade = 1,
  style,
}) => {
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const isLight = mode === "light";
  const height = insets.top + (isLight ? 36 : 72);

  const gradientColors = isLight
    ? [
        hexToRgba(colors.bgGradientTop, 1),
        hexToRgba(colors.bgGradientTop, 0.72),
        hexToRgba(colors.bg, 0),
      ]
    : [
        hexToRgba(colors.bg, 0.96),
        hexToRgba(colors.bg, 0.55),
        "transparent",
      ];

  // Light: keep container opaque but limit scrim height so content still bleeds edge-to-edge.
  // Dark: multiply by scrollFade for the classic intensifying scrim.
  const containerOpacity = isLight ? 1 : scrollFade;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { height, opacity: containerOpacity }, style]}
    >
      <LinearGradient
        colors={gradientColors as [string, string, string]}
        locations={isLight ? [0, 0.42, 1] : [0, 0.55, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 12,
  },
});

export default TopScrim;
