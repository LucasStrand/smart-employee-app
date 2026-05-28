import React from "react";
import { Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { GlassIconButton } from "@/components/glass/GlassIconButton";
import { getScreenTopPadding } from "@/lib/screenInsets";
import { useTheme } from "@/lib/ThemeContext";

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
          minHeight: 44,
        }}
      >
        {onBack ? (
          <GlassIconButton
            accessibilityLabel="Tillbaka"
            icon="chevron-back"
            onPress={onBack}
          />
        ) : (
          <View style={{ width: 44 }} />
        )}

        {trailingIcon ? (
          <GlassIconButton
            badged={trailingBadged}
            icon={trailingIcon}
            onPress={onTrailingPress}
          />
        ) : null}
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
