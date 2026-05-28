import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import { useTheme } from "@/lib/ThemeContext";

interface Props extends ViewProps {
  /** Show a subtle brand glow blob in the top-right corner */
  glow?: boolean;
}

/**
 * Themed background wrapper using html-theme.css `--bg` as a flat base in dark mode.
 */
export const Background: React.FC<Props> = ({
  children,
  glow = true,
  style,
  ...rest
}) => {
  const { colors, mode } = useTheme();

  return (
    <View
      style={[{ flex: 1, backgroundColor: colors.bg }, style]}
      {...rest}
    >
      {mode === "light" && (
        <>
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: colors.bgGradientTop,
                opacity: 0.85,
              },
            ]}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 320,
              backgroundColor: colors.bgGradientBottom,
              opacity: 0.65,
            }}
          />
        </>
      )}

      {glow && (
        <>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 280,
              height: 280,
              borderRadius: 999,
              backgroundColor: colors.brand,
              opacity: mode === "dark" ? 0.08 : 0.05,
            }}
          />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 60,
              right: 20,
              width: 140,
              height: 140,
              borderRadius: 999,
              backgroundColor: colors.brand,
              opacity: mode === "dark" ? 0.05 : 0.04,
            }}
          />
        </>
      )}
      {children}
    </View>
  );
};

export default Background;
