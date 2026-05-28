import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import type { Chapter, Category } from "@/lib/manual";
import { getCategory } from "@/lib/manual";

interface Props {
  chapter: Chapter;
  onPress?: () => void;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  showCategoryBadge?: boolean;
  style?: ViewStyle;
}

export const ChapterRow: React.FC<Props> = ({
  chapter,
  onPress,
  bookmarked,
  onToggleBookmark,
  showCategoryBadge,
  style,
}) => {
  const { colors } = useTheme();
  const category: Category | undefined = getCategory(chapter.categoryId);
  const tint = category ? (colors[category.colorKey] as string) : colors.brand;
  const tintBg = category
    ? (colors[`${category.colorKey}Bg` as keyof typeof colors] as string)
    : colors.brandGlow;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
          padding: 14,
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: tintBg,
          borderWidth: 1,
          borderColor: `${tint}55`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={(category?.iconName as any) ?? "book-outline"}
          size={20}
          color={tint}
        />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-Bold",
            fontSize: 15,
            letterSpacing: -0.2,
          }}
          numberOfLines={1}
        >
          {chapter.title}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {showCategoryBadge && category && (
            <Text
              style={{
                color: tint,
                fontFamily: "Jakarta-SemiBold",
                fontSize: 11,
              }}
            >
              {category.name}
            </Text>
          )}
          {showCategoryBadge && category && (
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 999,
                backgroundColor: colors.textSubtle,
              }}
            />
          )}
          <Text
            style={{
              color: colors.textSubtle,
              fontFamily: "Jakarta",
              fontSize: 12,
            }}
            numberOfLines={1}
          >
            {chapter.estimatedReadMinutes} min läsning
          </Text>
        </View>
      </View>

      {onToggleBookmark ? (
        <TouchableOpacity
          onPress={onToggleBookmark}
          hitSlop={10}
          style={{ paddingHorizontal: 4 }}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color={bookmarked ? colors.brand : colors.textSubtle}
          />
        </TouchableOpacity>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={colors.textSubtle} />
      )}
    </TouchableOpacity>
  );
};

export default ChapterRow;
