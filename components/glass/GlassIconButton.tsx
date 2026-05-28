import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { GlassView } from "@/components/glass/GlassView";
import { useTheme } from "@/lib/ThemeContext";

interface GlassIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  active?: boolean;
  badged?: boolean;
  accessibilityLabel?: string;
  hitSlop?: number;
  style?: ViewStyle;
}

/**
 * Circular iOS-style Liquid Glass icon button for headers and toolbars.
 */
export const GlassIconButton: React.FC<GlassIconButtonProps> = ({
  icon,
  onPress,
  size = 44,
  iconSize = 18,
  iconColor,
  active = false,
  badged = false,
  accessibilityLabel,
  hitSlop = 4,
  style,
}) => {
  const { colors } = useTheme();
  const radius = size / 2;
  const resolvedIconColor =
    iconColor ?? (active ? colors.brand : colors.text);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.85}
      disabled={!onPress}
      hitSlop={hitSlop}
      onPress={onPress}
      style={[{ width: size, height: size }, style]}
    >
      <GlassView
        borderless
        flat
        intensity="thin"
        isInteractive
        style={{
          flex: 1,
          borderRadius: radius,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={iconSize} color={resolvedIconColor} />
        {badged ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.brand,
                borderColor: colors.bg,
              },
            ]}
          />
        ) : null}
      </GlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1.5,
    height: 8,
    position: "absolute",
    right: 10,
    top: 10,
    width: 8,
  },
});

export default GlassIconButton;
