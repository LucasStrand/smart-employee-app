import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { getCategory, getChaptersByCategory } from "@/lib/manual";
import { useBookmarks } from "@/lib/useBookmarks";

import { CollapsibleScreen } from "@/components/playbook/CollapsibleScreen";
import { ChapterRow } from "@/components/playbook/ChapterRow";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";

const CategoryDetail = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = getCategory(String(id));
  const chapters = category ? getChaptersByCategory(category.id) : [];
  const { isBookmarked, toggleBookmark } = useBookmarks();

  if (!category) {
    return (
      <CollapsibleScreen
        variant="stack"
        header={<ScreenHeader title="Kategori saknas" onBack={router.back} />}
      >
        <View />
      </CollapsibleScreen>
    );
  }

  const tint = colors[category.colorKey] as string;
  const tintBg = colors[
    `${category.colorKey}Bg` as keyof typeof colors
  ] as string;

  const totalMinutes = chapters.reduce(
    (sum, c) => sum + c.estimatedReadMinutes,
    0
  );

  return (
    <CollapsibleScreen
      variant="stack"
      header={
        <ScreenHeader
          title={category.name}
          onBack={() => router.back()}
          trailingIcon="bookmark-outline"
          onTrailingPress={() => router.push("/(root)/(tabs)/favorites")}
        />
      }
      scrollProps={{
        contentContainerStyle: {
          paddingHorizontal: 20,
          paddingTop: 8,
        },
      }}
    >
          {/* Hero card */}
          <View
            style={{
              padding: 22,
              borderRadius: 22,
              backgroundColor: tintBg,
              borderWidth: 1,
              borderColor: `${tint}55`,
              overflow: "hidden",
              marginBottom: 22,
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 200,
                height: 200,
                borderRadius: 999,
                backgroundColor: tint,
                opacity: 0.12,
              }}
            />
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: `${tint}55`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Ionicons
                name={category.iconName as any}
                size={26}
                color={tint}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 4 }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: `${tint}55`,
                }}
              >
                <Text
                  style={{
                    color: tint,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 11,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  {chapters.length} kapitel
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: "Jakarta-SemiBold",
                    fontSize: 11,
                    letterSpacing: 0.4,
                  }}
                >
                  ~ {totalMinutes} min läsning
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: colors.text,
                fontFamily: "Jakarta-ExtraBold",
                fontSize: 22,
                letterSpacing: -0.5,
                marginTop: 8,
              }}
            >
              {category.name}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Jakarta",
                fontSize: 14,
                lineHeight: 21,
                marginTop: 6,
              }}
            >
              {category.description}
            </Text>
          </View>

          {/* Chapter list */}
          <Text
            style={{
              color: colors.textSubtle,
              fontFamily: "Jakarta-Bold",
              fontSize: 11,
              letterSpacing: 1.1,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Kapitel i kategorin
          </Text>
          <View style={{ gap: 10 }}>
            {chapters.map((c) => (
              <ChapterRow
                key={c.id}
                chapter={c}
                bookmarked={isBookmarked(c.id)}
                onToggleBookmark={() => toggleBookmark(c.id)}
                onPress={() =>
                  router.push({
                    pathname: "/(root)/chapter/[id]",
                    params: { id: c.id },
                  })
                }
              />
            ))}
          </View>
    </CollapsibleScreen>
  );
};

export default CategoryDetail;
