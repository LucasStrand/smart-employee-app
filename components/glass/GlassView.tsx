import React from "react";
import { Platform, View, ViewProps, ViewStyle, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import { useTheme } from "@/lib/ThemeContext";

type GlassIntensity = "thin" | "regular" | "thick" | "ultraThick";

interface GlassViewProps extends ViewProps {
  intensity?: GlassIntensity;
  /** Override blur intensity (0–100) */
  customIntensity?: number;
  /** Adds extra translucent tint on top */
  tintOpacity?: number;
  /** Removes the hairline border (default: false) */
  borderless?: boolean;
  /** Removes the inner highlight overlay (default: false) */
  flat?: boolean;
  style?: ViewStyle | ViewStyle[];
}

const intensityMap: Record<GlassIntensity, number> = {
  thin: 25,
  regular: 50,
  thick: 80,
  ultraThick: 100,
};

/**
 * Cross-platform "Liquid Glass" surface.
 *
 * iOS: uses BlurView with a system material tint (closest to Apple's Liquid
 * Glass without native modules). When tint="dark"/"light" comes from theme.
 * Android: uses expo-blur experimental dimezis blur method.
 * Web: falls back to a translucent surface with CSS backdrop blur
 * (handled by RN-Web via backgroundColor + a CSS class would be ideal,
 * but we keep it simple to stay portable).
 */
export const GlassView: React.FC<GlassViewProps> = ({
  children,
  style,
  intensity = "regular",
  customIntensity,
  tintOpacity = 0,
  borderless = false,
  flat = false,
  ...rest
}) => {
  const { colors, mode } = useTheme();
  const blurIntensity = customIntensity ?? intensityMap[intensity];

  const tint = mode === "dark" ? "dark" : "light";
  const baseTintColor =
    mode === "dark"
      ? `rgba(18, 18, 22, ${0.45 + tintOpacity})`
      : `rgba(255, 255, 255, ${0.55 + tintOpacity})`;

  const borderStyle: ViewStyle = borderless
    ? {}
    : {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.glassBorder,
      };

  if (Platform.OS === "ios") {
    return (
      <BlurView
        intensity={blurIntensity}
        tint={tint}
        style={[
          { overflow: "hidden" },
          borderStyle,
          style,
        ]}
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
