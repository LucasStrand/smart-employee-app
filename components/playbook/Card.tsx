import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { useTheme } from "@/lib/ThemeContext";

interface CardProps extends ViewProps {
  variant?: "default" | "raised" | "muted" | "highlight";
  padding?: number;
  radius?: number;
  borderColor?: string;
  style?: ViewStyle | ViewStyle[];
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "default",
  padding = 18,
  radius = 16,
  borderColor,
  style,
  ...rest
}) => {
  const { colors } = useTheme();
  const bg =
    variant === "raised"
      ? colors.surfaceRaised
      : variant === "muted"
      ? colors.surfaceMuted
      : variant === "highlight"
      ? colors.brandGlow
      : colors.surface;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius,
          padding,
          borderWidth: 1,
          borderColor:
            borderColor ?? (variant === "highlight" ? colors.borderBrand : colors.border),
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Card;
