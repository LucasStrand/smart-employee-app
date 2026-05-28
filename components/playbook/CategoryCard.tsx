import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import type { Category } from "@/lib/manual";

interface Props {
  category: Category;
  chapterCount: number;
  onPress?: () => void;
  size?: "default" | "compact";
  style?: ViewStyle;
}

export const CategoryCard: React.FC<Props> = ({
  category,
  chapterCount,
  onPress,
  size = "default",
  style,
}) => {
  const { colors } = useTheme();
  const colorKey = category.colorKey;
  const tint = colors[colorKey];
  const tintBg = colors[`${colorKey}Bg` as keyof typeof colors] as string;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        {
          flex: 1,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 18,
          padding: size === "compact" ? 14 : 16,
          overflow: "hidden",
          minHeight: size === "compact" ? 110 : 130,
        },
        style,
      ]}
    >
      {/* Decorative tinted blob */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 110,
          height: 110,
          borderRadius: 999,
          backgroundColor: tintBg,
          opacity: 0.9,
        }}
      />
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: tintBg,
          borderWidth: 1,
          borderColor: `${tint}55`,
          marginBottom: 12,
        }}
      >
        <Ionicons name={category.iconName as any} size={20} color={tint} />
      </View>
      <Text
        style={{
          color: colors.text,
          fontFamily: "Jakarta-Bold",
          fontSize: 15,
          letterSpacing: -0.2,
        }}
        numberOfLines={2}
      >
        {category.name}
      </Text>
      <Text
        style={{
          color: colors.textSubtle,
          fontFamily: "Jakarta",
          fontSize: 12,
          marginTop: 4,
        }}
        numberOfLines={1}
      >
        {chapterCount} kapitel
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
