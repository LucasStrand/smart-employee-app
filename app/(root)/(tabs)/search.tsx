import React, { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { chapters, getChapter } from "@/lib/manual";
import type { Block } from "@/lib/manual";
import { useBookmarks } from "@/lib/useBookmarks";

import { CollapsibleScreen } from "@/components/playbook/CollapsibleScreen";
import { ChapterRow } from "@/components/playbook/ChapterRow";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";
import { SearchBar } from "@/components/playbook/SearchBar";
import {
  getGridItemWidth,
  GRID_GAP,
  LIST_ROW_GAP,
  useResponsiveColumnCount,
} from "@/lib/responsiveGrid";

// Flatten all chapter content into searchable strings.
const buildSearchIndex = () =>
  chapters.map((chapter) => {
    const blocks = chapter.sections.flatMap((s) => s.blocks);
    const text = blocks
      .map((b: Block) => {
        switch (b.type) {
          case "paragraph":
          case "lede":
            return b.text;
          case "heading":
            return b.text;
          case "list":
            return b.items.join(" ");
          case "highlight":
            return [b.label, b.text].filter(Boolean).join(" ");
          case "formula":
            return b.text;
          case "check":
            return [b.title, b.body].filter(Boolean).join(" ");
          case "phase":
            return [
              b.number,
              b.title,
              ...b.body.map((x) => [x.paragraph, x.outcome].filter(Boolean).join(" ")),
            ].join(" ");
          case "columns":
            return b.columns
              .map((c) =>
                [c.title, c.paragraph, ...(c.items ?? [])]
                  .filter(Boolean)
                  .join(" ")
              )
              .join(" ");
          case "table":
            return [b.headers.join(" "), ...b.rows.map((r) => r.join(" "))].join(
              " "
            );
          case "colorRow":
            return [b.system, b.color, b.comment].join(" ");
          default:
            return "";
        }
      })
      .join(" ");
    return {
      id: chapter.id,
      haystack:
        `${chapter.title} ${chapter.shortTitle} ${chapter.summary} ${text}`.toLowerCase(),
    };
  });

const popularQueries = [
  "Rackritning",
  "Märkning",
  "Färgstandard",
  "BTU",
  "Projektfaser",
  "Wire checklist",
  "PoE",
  "Överlämning",
];

const Search = () => {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const topicColumns = useResponsiveColumnCount(3);
  const topicItemWidth = getGridItemWidth(screenWidth, topicColumns, {
    gap: GRID_GAP,
    horizontalPadding: 20,
  });
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ q?: string }>();
  const { recentSearches, addRecentSearch, clearRecentSearches, isBookmarked, toggleBookmark } =
    useBookmarks();

  const [query, setQuery] = useState(params.q ?? "");
  const searchIndex = useMemo(buildSearchIndex, []);

  useEffect(() => {
    if (params.q) setQuery(params.q);
  }, [params.q]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
          .filter((idx: { haystack: string }) => idx.haystack.includes(q))
      .map((idx: { id: string }) => getChapter(idx.id))
      .filter(Boolean) as ReturnType<typeof getChapter>[];
  }, [query, searchIndex]);

  return (
    <CollapsibleScreen
      header={<ScreenHeader title="Sök" />}
      scrollProps={{
        keyboardShouldPersistTaps: "handled",
        contentContainerStyle: {
          paddingHorizontal: 20,
          paddingTop: 8,
        },
      }}
    >
          <SearchBar
            value={query}
            onChangeText={setQuery}
            autoFocus={!query}
            placeholder="Sök på t.ex. PoE, BTU, rack…"
          />
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: "Jakarta",
              fontSize: 14,
              lineHeight: 21,
              marginTop: 10,
              marginBottom: 18,
            }}
          >
            Sök på begrepp, system, fas eller rolltyp.
          </Text>
          {query.trim().length === 0 ? (
            <>
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 16,
                    marginBottom: 12,
                  }}
                >
                  Populära ämnen
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: GRID_GAP }}>
                  {popularQueries.map((q) => (
                    <TouchableOpacity
                      key={q}
                      onPress={() => setQuery(q)}
                      style={{
                        width: topicItemWidth,
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 999,
                        backgroundColor: colors.surface,
                        borderWidth: 1,
                        borderColor: colors.border,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="trending-up-outline"
                        size={14}
                        color={colors.brand}
                      />
                      <Text
                        style={{
                          flex: 1,
                          color: colors.text,
                          fontFamily: "Jakarta-SemiBold",
                          fontSize: 13,
                        }}
                        numberOfLines={1}
                      >
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {recentSearches.length > 0 && (
                <View style={{ marginTop: LIST_ROW_GAP }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: LIST_ROW_GAP,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: "Jakarta-Bold",
                        fontSize: 16,
                      }}
                    >
                      Senaste sökningar
                    </Text>
                    <TouchableOpacity onPress={() => clearRecentSearches()}>
                      <Text
                        style={{
                          color: colors.brand,
                          fontFamily: "Jakarta-SemiBold",
                          fontSize: 12,
                        }}
                      >
                        Rensa
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ gap: LIST_ROW_GAP }}>
                    {recentSearches.map((q: string) => (
                      <TouchableOpacity
                        key={q}
                        onPress={() => setQuery(q)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 12,
                          padding: 14,
                          borderRadius: 14,
                          backgroundColor: colors.surface,
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color={colors.textSubtle}
                        />
                        <Text
                          style={{
                            flex: 1,
                            color: colors.text,
                            fontFamily: "Jakarta-Medium",
                            fontSize: 14,
                          }}
                        >
                          {q}
                        </Text>
                        <Ionicons
                          name="arrow-up-outline"
                          size={14}
                          color={colors.textSubtle}
                          style={{ transform: [{ rotate: "45deg" }] }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </>
          ) : (
            <View>
              <Text
                style={{
                  color: colors.textSubtle,
                  fontFamily: "Jakarta-SemiBold",
                  fontSize: 12,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {results.length} träff
                {results.length === 1 ? "" : "ar"} för {`"${query}"`}
              </Text>
              <View style={{ gap: 10 }}>
                {results.map((c) =>
                  c ? (
                    <ChapterRow
                      key={c.id}
                      chapter={c}
                      bookmarked={isBookmarked(c.id)}
                      onToggleBookmark={() => toggleBookmark(c.id)}
                      showCategoryBadge
                      onPress={() => {
                        addRecentSearch(query);
                        router.push({
                          pathname: "/(root)/chapter/[id]",
                          params: { id: c.id },
                        });
                      }}
                    />
                  ) : null
                )}
              </View>
              {results.length === 0 && (
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 40,
                  }}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 999,
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Ionicons
                      name="search"
                      size={22}
                      color={colors.textSubtle}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: "Jakarta-Bold",
                      fontSize: 15,
                    }}
                  >
                    Inget hittades
                  </Text>
                  <Text
                    style={{
                      color: colors.textSubtle,
                      fontFamily: "Jakarta",
                      fontSize: 13,
                      marginTop: 4,
                      textAlign: "center",
                      maxWidth: 260,
                    }}
                  >
                    Prova ett annat sökord eller bläddra i biblioteket.
                  </Text>
                </View>
              )}
            </View>
          )}
    </CollapsibleScreen>
  );
};

export default Search;
