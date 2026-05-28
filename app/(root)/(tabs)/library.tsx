import React, { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import {
  categories,
  chapters,
  getChaptersByCategory,
  manualMeta,
} from "@/lib/manual";
import { useBookmarks } from "@/lib/useBookmarks";

import { ChapterRow } from "@/components/playbook/ChapterRow";
import { CollapsibleScreen } from "@/components/playbook/CollapsibleScreen";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";

const Library = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [activeCat, setActiveCat] = useState<string>(categories[0].id);

  const activeChapters = useMemo(
    () => getChaptersByCategory(activeCat),
    [activeCat]
  );
  const active = categories.find((c) => c.id === activeCat);
  const tint = active ? (colors[active.colorKey] as string) : colors.brand;
  const tintBg = active
    ? (colors[`${active.colorKey}Bg` as keyof typeof colors] as string)
    : colors.brandGlow;

  return (
    <CollapsibleScreen
      header={
        <>
          <ScreenHeader
            eyebrow={`Manual · ${manualMeta.version}`}
            title="Bibliotek"
            subtitle={`${chapters.length} kapitel uppdelade i ${categories.length} kategorier`}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 4,
              gap: 8,
            }}
          >
            {categories.map((cat) => {
              const isActive = cat.id === activeCat;
              const localTint = colors[cat.colorKey] as string;
              const localBg = colors[
                `${cat.colorKey}Bg` as keyof typeof colors
              ] as string;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => setActiveCat(cat.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 999,
                    backgroundColor: isActive ? localBg : colors.surface,
                    borderWidth: 1,
                    borderColor: isActive ? `${localTint}66` : colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons
                    name={cat.iconName as any}
                    size={14}
                    color={isActive ? localTint : colors.textMuted}
                  />
                  <Text
                    style={{
                      color: isActive ? localTint : colors.textMuted,
                      fontFamily: isActive ? "Jakarta-Bold" : "Jakarta-SemiBold",
                      fontSize: 13,
                    }}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </>
      }
      scrollProps={{
        contentContainerStyle: {
          paddingHorizontal: 20,
          paddingTop: 18,
        },
      }}
    >
          {/* Selected category card */}
          {active && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(root)/category/[id]",
                  params: { id: active.id },
                })
              }
              activeOpacity={0.85}
              style={{
                padding: 18,
                borderRadius: 18,
                backgroundColor: tintBg,
                borderWidth: 1,
                borderColor: `${tint}55`,
                marginBottom: 18,
                overflow: "hidden",
              }}
            >
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 180,
                  height: 180,
                  borderRadius: 999,
                  backgroundColor: tint,
                  opacity: 0.12,
                }}
              />
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: `${tint}55`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name={active.iconName as any}
                  size={22}
                  color={tint}
                />
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: "Jakarta-ExtraBold",
                  fontSize: 20,
                  letterSpacing: -0.4,
                }}
              >
                {active.name}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: "Jakarta",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                {active.description}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  gap: 6,
                }}
              >
                <Text
                  style={{
                    color: tint,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 12,
                  }}
                >
                  Öppna översikt
                </Text>
                <Ionicons name="arrow-forward" size={14} color={tint} />
              </View>
            </TouchableOpacity>
          )}

          {/* Chapters */}
          <View style={{ gap: 10 }}>
            {activeChapters.map((c) => (
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

export default Library;
