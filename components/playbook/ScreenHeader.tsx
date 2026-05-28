import React from "react";
import { Text, View, TouchableOpacity, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { getScreenTopPadding } from "@/lib/screenInsets";

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onTrailingPress?: () => void;
  trailingBadged?: boolean;
  style?: ViewStyle;
}

export const ScreenHeader: React.FC<Props> = ({
  title,
  subtitle,
  eyebrow,
  onBack,
  trailingIcon,
  onTrailingPress,
  trailingBadged,
  style,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          paddingHorizontal: 20,
          paddingTop: getScreenTopPadding(insets, 4),
          paddingBottom: 14,
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 32,
        }}
      >
        {onBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={10}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="chevron-back" size={18} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {trailingIcon && (
          <TouchableOpacity
            onPress={onTrailingPress}
            hitSlop={10}
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name={trailingIcon} size={18} color={colors.text} />
            {trailingBadged && (
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: colors.brand,
                  borderWidth: 1.5,
                  borderColor: colors.surface,
                }}
              />
            )}
          </TouchableOpacity>
        )}
      </View>

      {eyebrow && (
        <Text
          style={{
            color: colors.brand,
            fontFamily: "Jakarta-Bold",
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            marginTop: 18,
          }}
        >
          {eyebrow}
        </Text>
      )}

      <Text
        style={{
          color: colors.text,
          fontFamily: "Jakarta-ExtraBold",
          fontSize: 28,
          letterSpacing: -0.8,
          marginTop: eyebrow ? 6 : 14,
        }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Jakarta",
            fontSize: 14.5,
            marginTop: 6,
            lineHeight: 21,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default ScreenHeader;
