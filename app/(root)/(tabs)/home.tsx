import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { ApiType } from "@/lib/apiConfig";
import { fetchAPI } from "@/lib/fetch";
import {
  categories,
  chapters,
  getChapter,
  manualMeta,
} from "@/lib/manual";
import { useBookmarks } from "@/lib/useBookmarks";

import { Background } from "@/components/playbook/Background";
import { GlassIconButton } from "@/components/glass/GlassIconButton";
import { CategoryCard } from "@/components/playbook/CategoryCard";
import { ChapterRow } from "@/components/playbook/ChapterRow";
import { CollapsibleScreen } from "@/components/playbook/CollapsibleScreen";
import { Pill } from "@/components/playbook/Pill";
import { SearchBar } from "@/components/playbook/SearchBar";
import { SectionHeader } from "@/components/playbook/SectionHeader";
import { StatTile } from "@/components/playbook/StatTile";
import { getScreenTopPadding } from "@/lib/screenInsets";

const Home = () => {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { recent, isBookmarked, toggleBookmark } = useBookmarks();

  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUserFromGraph = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          setLoading(false);
          return;
        }
        const userData = await fetchAPI(
          "/me",
          { method: "GET" },
          ApiType.GRAPH
        );
        setUserName(userData?.givenName ?? null);
      } catch {
        // graceful fallback
      } finally {
        setLoading(false);
      }
    };
    loadUserFromGraph();
  }, []);

  const recentChapters = (
    recent.length
      ? recent.map((id: string) => getChapter(id)).filter(Boolean)
      : chapters.slice(0, 3)
  ) as ReturnType<typeof getChapter>[];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 6) return "God natt";
    if (hour < 11) return "God morgon";
    if (hour < 17) return "Hej";
    if (hour < 22) return "God kväll";
    return "God natt";
  })();

  if (loading) {
    return (
      <Background>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={colors.brand} size="large" />
        </View>
      </Background>
    );
  }

  return (
    <CollapsibleScreen
      header={
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingHorizontal: 20,
            paddingTop: getScreenTopPadding(insets, 10),
            paddingBottom: 10,
          }}
        >
          <GlassIconButton
            accessibilityLabel="Notiser"
            badged
            icon="notifications-outline"
            onPress={() => router.push("/(root)/(tabs)/profile")}
          />
        </View>
      }
    >
      <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
        <Text
          style={{
            color: colors.brand,
            fontFamily: "Jakarta-Bold",
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          Intern standard · {manualMeta.version}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-ExtraBold",
            fontSize: 30,
            lineHeight: 36,
            letterSpacing: -0.9,
            marginTop: 8,
          }}
        >
          {greeting}
          {userName ? `, ${userName}` : ""}.{"\n"}
          <Text style={{ color: colors.brand }}>Så här arbetar vi.</Text>
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Jakarta",
            fontSize: 14.5,
            lineHeight: 22,
            marginTop: 10,
            maxWidth: 360,
          }}
        >
          {manualMeta.description}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <SearchBar
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            if (t.trim().length > 0) {
              router.push({
                pathname: "/(root)/(tabs)/search",
                params: { q: t },
              });
            }
          }}
          placeholder="Sök i manualen…"
          showFilter
          onFilterPress={() => router.push("/(root)/(tabs)/library")}
        />
      </View>

      {/* Stat strip */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 20,
          marginTop: 18,
        }}
      >
            <StatTile
              accent
              label="Kapitel"
              value={String(chapters.length)}
            />
            <StatTile
              label="Kategorier"
              value={String(categories.length)}
            />
            <StatTile
              label="Faser"
              value="6"
            />
          </View>

          {/* Categories */}
          <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
            <SectionHeader
              title="Bläddra efter kategori"
              actionLabel="Visa alla"
              onActionPress={() => router.push("/(root)/(tabs)/library")}
            />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {categories.map((cat) => (
                <View
                  key={cat.id}
                  style={{ width: "48.5%", marginBottom: 0 }}
                >
                  <CategoryCard
                    category={cat}
                    chapterCount={cat.chapterIds.length}
                    onPress={() =>
                      router.push({
                        pathname: "/(root)/category/[id]",
                        params: { id: cat.id },
                      })
                    }
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Recently updated / recently read */}
          <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
            <SectionHeader
              title={recent.length ? "Senast läst" : "Senast uppdaterat"}
              actionLabel="Visa alla"
              onActionPress={() => router.push("/(root)/(tabs)/library")}
            />
            <View style={{ gap: 10 }}>
              {recentChapters.slice(0, 4).map(
                (c) =>
                  c && (
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
                  )
              )}
            </View>
          </View>

          {/* Tools */}
          <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
            <SectionHeader
              title="Verktyg"
              eyebrow="För arbete på plats"
            />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/(root)/browse-workorders")}
              style={{
                padding: 18,
                borderRadius: 18,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
              }}
            >
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 160,
                  height: 160,
                  borderRadius: 999,
                  backgroundColor: colors.brand,
                  opacity: mode === "dark" ? 0.08 : 0.06,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor: colors.brandGlow,
                    borderWidth: 1,
                    borderColor: colors.borderBrand,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={22}
                    color={colors.brand}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: "Jakarta-Bold",
                      fontSize: 16,
                      letterSpacing: -0.2,
                    }}
                  >
                    Arbetsordrar & checklistor
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: "Jakarta",
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    Tilldelade uppgifter och egenkontroll
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textSubtle}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 14,
                }}
              >
                <Pill label="Wire checklist" />
                <Pill label="Egenkontroll" />
                <Pill label="As-built" variant="outline" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View
            style={{
              paddingHorizontal: 20,
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.textSubtle,
                fontFamily: "Jakarta",
                fontSize: 12,
              }}
            >
              {manualMeta.title} · {manualMeta.version} · {manualMeta.updatedAt}
            </Text>
          </View>
    </CollapsibleScreen>
  );
};

export default Home;
