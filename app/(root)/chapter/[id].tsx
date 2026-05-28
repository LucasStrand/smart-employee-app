import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import {
  Block,
  getCategory,
  getChapter,
  Section,
} from "@/lib/manual";
import { useBookmarks } from "@/lib/useBookmarks";

import { Background } from "@/components/playbook/Background";
import { ContentBlock } from "@/components/playbook/ContentBlock";

const ChapterScreen = () => {
  const router = useRouter();
  const { colors, mode } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chapter = getChapter(String(id));
  const category = chapter ? getCategory(chapter.categoryId) : undefined;
  const tint = category ? (colors[category.colorKey] as string) : colors.brand;
  const tintBg = category
    ? (colors[`${category.colorKey}Bg` as keyof typeof colors] as string)
    : colors.brandGlow;

  const { isBookmarked, toggleBookmark, trackRead } = useBookmarks();

  const [progress, setProgress] = useState(0);
  const [marked, setMarked] = useState(false);

  useEffect(() => {
    if (chapter) trackRead(chapter.id);
  }, [chapter, trackRead]);

  if (!chapter) {
    return (
      <Background>
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
          <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text
              style={{
                color: colors.text,
                fontFamily: "Jakarta-Bold",
                fontSize: 22,
                marginTop: 20,
              }}
            >
              Kapitel saknas
            </Text>
          </View>
        </SafeAreaView>
      </Background>
    );
  }

  const isB = isBookmarked(chapter.id);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Top bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 4,
            paddingBottom: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
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

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => toggleBookmark(chapter.id)}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isB ? colors.brandGlow : colors.surface,
                borderWidth: 1,
                borderColor: isB ? colors.borderBrand : colors.border,
              }}
            >
              <Ionicons
                name={isB ? "bookmark" : "bookmark-outline"}
                size={18}
                color={isB ? colors.brand : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Share.share({
                  message: `${chapter.title} – Smart Teknik Standard`,
                })
              }
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
              <Ionicons name="share-outline" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* progress strip */}
        <View
          style={{
            marginHorizontal: 20,
            height: 3,
            borderRadius: 999,
            backgroundColor: colors.surfaceMuted,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: 3,
              backgroundColor: tint,
              borderRadius: 999,
            }}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={32}
          onScroll={(e) => {
            const { contentOffset, contentSize, layoutMeasurement } =
              e.nativeEvent;
            const total = Math.max(
              1,
              contentSize.height - layoutMeasurement.height
            );
            const p = Math.min(1, Math.max(0, contentOffset.y / total));
            setProgress(p);
          }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 200,
          }}
        >
          {/* Hero */}
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
                width: 220,
                height: 220,
                borderRadius: 999,
                backgroundColor: tint,
                opacity: 0.12,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: `${tint}55`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={(category?.iconName as any) ?? "book-outline"}
                  size={18}
                  color={tint}
                />
              </View>
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
                    letterSpacing: 0.6,
                    textTransform: "uppercase",
                  }}
                >
                  {category?.name ?? "Kapitel"}
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
                  }}
                >
                  Kapitel {chapter.numberLabel}
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: colors.text,
                fontFamily: "Jakarta-ExtraBold",
                fontSize: 26,
                letterSpacing: -0.6,
                lineHeight: 32,
                marginTop: 14,
              }}
            >
              {chapter.title}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Jakarta",
                fontSize: 14.5,
                lineHeight: 22,
                marginTop: 8,
              }}
            >
              {chapter.summary}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 14,
                marginTop: 16,
              }}
            >
              <Meta
                icon="time-outline"
                label={`${chapter.estimatedReadMinutes} min läsning`}
              />
              <Meta
                icon="calendar-outline"
                label={`Uppdaterad ${chapter.updatedAt}`}
              />
            </View>
          </View>

          {/* Sections */}
          {chapter.sections.map((section, sIndex) => (
            <SectionView
              key={section.id}
              section={section}
              isFirst={sIndex === 0}
              accent={tint}
            />
          ))}

          {/* Footer actions */}
          <View
            style={{
              padding: 18,
              borderRadius: 18,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              marginTop: 30,
              gap: 14,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontFamily: "Jakarta-Bold",
                fontSize: 16,
              }}
            >
              Var detta kapitel användbart?
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <FooterAction icon="thumbs-up-outline" label="Ja" onPress={() => {}} />
              <FooterAction icon="thumbs-down-outline" label="Nej" onPress={() => {}} />
              <TouchableOpacity
                onPress={() => setMarked((m) => !m)}
                activeOpacity={0.85}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 999,
                  backgroundColor: marked ? colors.success : tint,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 6,
                }}
              >
                <Ionicons
                  name={marked ? "checkmark-circle" : "checkmark"}
                  size={16}
                  color={colors.brandOnBrand}
                />
                <Text
                  style={{
                    color: colors.brandOnBrand,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 13,
                  }}
                >
                  {marked ? "Läst" : "Markera som läst"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const Meta: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}> = ({ icon, label }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Ionicons name={icon} size={13} color={colors.textSubtle} />
      <Text
        style={{
          color: colors.textSubtle,
          fontFamily: "Jakarta-SemiBold",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const FooterAction: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}> = ({ icon, label, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        width: 48,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.surfaceMuted,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={18} color={colors.textMuted} />
    </TouchableOpacity>
  );
};

const SectionView: React.FC<{
  section: Section;
  isFirst: boolean;
  accent: string;
}> = ({ section, isFirst, accent }) => {
  const { colors } = useTheme();
  const blocks = section.blocks;

  // Group consecutive "phase" or "check" blocks so we can draw connector
  // lines between them properly.
  const items = useMemo(() => groupSequential(blocks), [blocks]);

  return (
    <View style={{ marginTop: isFirst ? 0 : 14 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            width: 4,
            height: 18,
            borderRadius: 999,
            backgroundColor: accent,
          }}
        />
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-Bold",
            fontSize: 18,
            letterSpacing: -0.3,
          }}
        >
          {section.title}
        </Text>
      </View>

      <View style={{ gap: 14 }}>
        {items.map((entry, idx) => {
          if (entry.kind === "single") {
            return (
              <ContentBlock
                key={idx}
                block={entry.block}
                accent={accent}
              />
            );
          }
          return (
            <View key={idx} style={{ gap: 0 }}>
              {entry.blocks.map((b, i) => (
                <ContentBlock
                  key={i}
                  block={b}
                  isLast={i === entry.blocks.length - 1}
                  accent={accent}
                />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

type GroupItem =
  | { kind: "single"; block: Block }
  | { kind: "group"; blocks: Block[] };

const groupSequential = (blocks: Block[]): GroupItem[] => {
  const out: GroupItem[] = [];
  let buf: Block[] = [];
  const flush = () => {
    if (buf.length > 0) {
      out.push({ kind: "group", blocks: buf });
      buf = [];
    }
  };
  for (const b of blocks) {
    if (b.type === "phase" || b.type === "check") {
      buf.push(b);
    } else {
      flush();
      out.push({ kind: "single", block: b });
    }
  }
  flush();
  return out;
};

export default ChapterScreen;
