import React from "react";
import { Platform, View, ViewProps, ViewStyle, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import {
  GlassView as NativeLiquidGlassView,
  isGlassEffectAPIAvailable,
  isLiquidGlassAvailable,
  type GlassStyle,
} from "expo-glass-effect";

import { useTheme } from "@/lib/ThemeContext";

type GlassIntensity = "thin" | "regular" | "thick" | "ultraThick";

interface GlassViewProps extends ViewProps {
  intensity?: GlassIntensity;
  /** Override blur intensity (0–100) for non-native glass fallbacks */
  customIntensity?: number;
  /** Adds extra translucent tint on top (blur fallback only) */
  tintOpacity?: number;
  /** Removes the hairline border (default: false) */
  borderless?: boolean;
  /** Removes the inner highlight overlay (default: false) */
  flat?: boolean;
  /** Native iOS Liquid Glass: enables touch-responsive glass (default: false) */
  isInteractive?: boolean;
  style?: ViewStyle | ViewStyle[];
}

const intensityMap: Record<GlassIntensity, number> = {
  thin: 25,
  regular: 50,
  thick: 80,
  ultraThick: 100,
};

const intensityToGlassStyle = (intensity: GlassIntensity): GlassStyle => {
  if (intensity === "thin") return "clear";
  return "regular";
};

/** True when native iOS 26+ Liquid Glass can be rendered safely. */
export function isNativeLiquidGlassSupported(): boolean {
  return (
    Platform.OS === "ios" &&
    isLiquidGlassAvailable() &&
    isGlassEffectAPIAvailable()
  );
}

export { isLiquidGlassAvailable, isGlassEffectAPIAvailable };

/**
 * Cross-platform glass surface.
 *
 * iOS 26+: native Liquid Glass via `expo-glass-effect` (UIVisualEffectView).
 * Older iOS / Android: `expo-blur` with theme tint overlays.
 * Web: translucent surface fallback.
 */
export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  intensity = "regular",
  customIntensity,
  tintOpacity = 0,
  borderless = false,
  flat = false,
  isInteractive = false,
  ...rest
}) => {
  const { colors, mode } = useTheme();
  const blurIntensity = customIntensity ?? intensityMap[intensity];
  const useNativeLiquidGlass = isNativeLiquidGlassSupported();

  const borderStyle: ViewStyle = borderless
    ? {}
    : {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.glassBorder,
      };

  if (useNativeLiquidGlass) {
    return (
      <NativeLiquidGlassView
        glassEffectStyle={intensityToGlassStyle(intensity)}
        colorScheme={mode}
        isInteractive={isInteractive}
        style={[{ overflow: "hidden" }, borderStyle, style]}
        {...rest}
      >
        {children}
      </NativeLiquidGlassView>
    );
  }

  const tint = mode === "dark" ? "dark" : "light";
  const baseTintColor =
    mode === "dark"
      ? `rgba(18, 18, 22, ${0.45 + tintOpacity})`
      : `rgba(255, 255, 255, ${0.55 + tintOpacity})`;

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        style={[{ overflow: "hidden" }, borderStyle, style]}
        {...rest}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: baseTintColor },
          ]}
        />
        {!flat && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.glassHighlight,
              },
            ]}
          />
        )}
        {children}
      </BlurView>
    );
  }

  if (Platform.OS === "android") {
    return (
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        experimentalBlurMethod="dimezisBlurView"
        style={[{ overflow: "hidden" }, borderStyle, style]}
        {...rest}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: baseTintColor },
          ]}
        />
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        {
          backgroundColor: baseTintColor,
          overflow: "hidden",
        },
        borderStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default GlassView;
