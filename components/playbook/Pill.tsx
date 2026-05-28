import React from "react";
import { Text, View, ViewStyle } from "react-native";

import { useTheme } from "@/lib/ThemeContext";

interface PillProps {
  label: string;
  variant?: "default" | "brand" | "outline" | "success";
  size?: "sm" | "md";
  style?: ViewStyle;
}

export const Pill: React.FC<PillProps> = ({
  label,
  variant = "default",
  size = "md",
  style,
}) => {
  const { colors } = useTheme();
  const pad = size === "sm" ? { px: 8, py: 3 } : { px: 11, py: 5 };
  const fs = size === "sm" ? 10.5 : 11.5;

  const styles = (() => {
    switch (variant) {
      case "brand":
        return {
          background: colors.brandGlow,
          border: colors.borderBrand,
          color: colors.brand,
        };
      case "outline":
        return {
          background: "transparent",
          border: colors.border,
          color: colors.textMuted,
        };
      case "success":
        return {
          background: `${colors.success}1A`,
          border: `${colors.success}55`,
          color: colors.success,
        };
      default:
        return {
          background: colors.surfaceRaised,
          border: colors.border,
          color: colors.textMuted,
        };
    }
  })();

  return (
    <View
      style={[
        {
          backgroundColor: styles.background,
          borderColor: styles.border,
          borderWidth: 1,
          borderRadius: 999,
          paddingHorizontal: pad.px,
          paddingVertical: pad.py,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: styles.color,
          fontSize: fs,
          fontFamily: "Jakarta-SemiBold",
          letterSpacing: 0.4,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
    </View>
  );
};

export default Pill;
