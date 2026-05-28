import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { chapters, getChapter } from "@/lib/manual";
import { useBookmarks } from "@/lib/useBookmarks";

import { Background } from "@/components/playbook/Background";
import { ChapterRow } from "@/components/playbook/ChapterRow";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";

const Favorites = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { bookmarks, isBookmarked, toggleBookmark } = useBookmarks();

  const items = bookmarks
    .map((id: string) => getChapter(id))
    .filter(Boolean) as ReturnType<typeof getChapter>[];

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader
          eyebrow="Sparat"
          title="Favoriter"
          subtitle={`${items.length} ${items.length === 1 ? "kapitel" : "kapitel"} sparade`}
        />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 60,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  backgroundColor: colors.brandGlow,
                  borderWidth: 1,
                  borderColor: colors.borderBrand,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 18,
                }}
              >
                <Ionicons name="bookmark" size={28} color={colors.brand} />
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: "Jakarta-Bold",
                  fontSize: 18,
                  letterSpacing: -0.2,
                }}
              >
                Inga favoriter ännu
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: "Jakarta",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 8,
                  maxWidth: 300,
                  lineHeight: 21,
                }}
              >
                Spara kapitel du återvänder till genom att trycka på bokmärket
                på ett kapitel.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/library")}
                style={{
                  marginTop: 22,
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 999,
                  backgroundColor: colors.brand,
                }}
              >
                <Text
                  style={{
                    color: colors.brandOnBrand,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 14,
                  }}
                >
                  Utforska biblioteket
                </Text>
              </TouchableOpacity>

              {/* Suggested */}
              <View style={{ width: "100%", marginTop: 36 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  Föreslagna att spara
                </Text>
                <View style={{ gap: 10 }}>
                  {chapters.slice(0, 3).map((c) => (
                    <ChapterRow
                      key={c.id}
                      chapter={c}
                      bookmarked={isBookmarked(c.id)}
                      onToggleBookmark={() => toggleBookmark(c.id)}
                      showCategoryBadge
                      onPress={() =>
                        router.push({
                          pathname: "/(root)/chapter/[id]",
                          params: { id: c.id },
                        })
                      }
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {items.map((c) =>
                c ? (
                  <ChapterRow
                    key={c.id}
                    chapter={c}
                    bookmarked={isBookmarked(c.id)}
                    onToggleBookmark={() => toggleBookmark(c.id)}
                    showCategoryBadge
                    onPress={() =>
                      router.push({
                        pathname: "/(root)/chapter/[id]",
                        params: { id: c.id },
                      })
                    }
                  />
                ) : null
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

export default Favorites;
