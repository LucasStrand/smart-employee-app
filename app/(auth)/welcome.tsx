import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { images, onboarding } from "@/constants";
import { Background } from "@/components/playbook/Background";
import { LogoMark } from "@/components/playbook/LogoMark";

type Slide = {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  image: number;
};

type WebScrollRef = ScrollView & {
  getScrollableNode?: () => HTMLElement;
};

const Welcome = () => {
  const { width: windowWidth } = useWindowDimensions();
  const { colors, mode } = useTheme();
  const pagerRef = useRef<PagerView>(null);
  const webScrollRef = useRef<WebScrollRef | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(windowWidth);

  const slides = useMemo<Slide[]>(
    () => [
      {
        id: 1,
        eyebrow: "Smart Teknik",
        title: "Vår samlade standard",
        description:
          "Manualen som beskriver hur vi planerar, projekterar, installerar, märker, bygger och lämnar över.",
        image: mode === "dark" ? images.logoWhite : onboarding[0].image,
      },
      {
        id: 2,
        eyebrow: "Tillsammans",
        title: "En kompanjon i fält",
        description:
          "Alla i teamet – från sälj till support – arbetar efter samma underlag, märkstandard och kvalitetsgrindar.",
        image: onboarding[1].image,
      },
      {
        id: 3,
        eyebrow: "Operativt verktyg",
        title: "Checklistor & arbetsordrar",
        description:
          "Egenkontroll, wire checklist, rackritning och as-built – allt nära till hands när du behöver det.",
        image: onboarding[2].image,
      },
    ],
    [mode]
  );

  const isLastSlide = activeIndex === slides.length - 1;

  const handlePageChange = useCallback((index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, []);

  const scrollWebToIndex = useCallback(
    (index: number) => {
      const offset = index * pageWidth;
      const scroller =
        (webScrollRef.current as unknown as HTMLElement | null) ??
        webScrollRef.current?.getScrollableNode?.() ??
        null;

      if (!scroller || scroller.scrollWidth <= scroller.clientWidth) return;

      const previousSnap = scroller.style.scrollSnapType;
      scroller.style.scrollSnapType = "none";
      scroller.scrollTo({ left: offset, behavior: "smooth" });
      globalThis.setTimeout(() => {
        scroller.scrollLeft = offset;
        scroller.style.scrollSnapType = previousSnap || "x mandatory";
      }, 400);
    },
    [pageWidth]
  );

  const syncWebIndexFromScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;

      const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      if (index >= 0 && index < slides.length) {
        handlePageChange(index);
      }
    },
    [handlePageChange, pageWidth, slides.length]
  );

  const goNext = useCallback(() => {
    const currentIndex = activeIndexRef.current;

    if (currentIndex >= slides.length - 1) {
      router.replace("/(auth)/sign-in");
      return;
    }

    const nextIndex = currentIndex + 1;

    if (Platform.OS === "web") {
      scrollWebToIndex(nextIndex);
      handlePageChange(nextIndex);
      return;
    }

    pagerRef.current?.setPage(nextIndex);
  }, [handlePageChange, scrollWebToIndex, slides.length]);

  const renderSlide = useCallback(
    (item: Slide) => (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={item.image}
          style={{
            width: pageWidth - 56,
            height: pageWidth * 0.72,
            marginTop: 12,
          }}
          resizeMode="contain"
        />

        <Text
          style={{
            color: colors.brand,
            fontFamily: "Jakarta-Bold",
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            marginTop: 32,
          }}
        >
          {item.eyebrow}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-ExtraBold",
            fontSize: 26,
            letterSpacing: -0.6,
            textAlign: "center",
            marginTop: 8,
            paddingHorizontal: 16,
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Jakarta",
            fontSize: 15,
            lineHeight: 22,
            textAlign: "center",
            marginTop: 10,
            paddingHorizontal: 12,
            maxWidth: 360,
          }}
        >
          {item.description}
        </Text>
      </View>
    ),
    [colors.brand, colors.text, colors.textMuted, pageWidth]
  );

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 10,
          }}
        >
          <LogoMark
            size={36}
            showWordmark
            wordmark="Smart Teknik"
            subtitle="Standard"
          />
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/sign-in")}
            hitSlop={10}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 7,
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
                fontSize: 12,
              }}
            >
              Hoppa över
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{ flex: 1 }}
          onLayout={(event) => {
            const nextWidth = Math.round(event.nativeEvent.layout.width);
            if (nextWidth > 0) {
              setPageWidth(nextWidth);
            }
          }}
        >
          {Platform.OS === "web" ? (
            <ScrollView
              ref={webScrollRef}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              decelerationRate="fast"
              onScroll={syncWebIndexFromScroll}
              onMomentumScrollEnd={syncWebIndexFromScroll}
              style={{ flex: 1 }}
            >
              {slides.map((item) => (
                <View key={item.id} style={{ width: pageWidth }}>
                  {renderSlide(item)}
                </View>
              ))}
            </ScrollView>
          ) : (
            <PagerView
              ref={pagerRef}
              style={{ flex: 1 }}
              initialPage={0}
              overdrag
              onPageSelected={(event) =>
                handlePageChange(event.nativeEvent.position)
              }
            >
              {slides.map((item) => (
                <View key={item.id} collapsable={false} style={{ flex: 1 }}>
                  {renderSlide(item)}
                </View>
              ))}
            </PagerView>
          )}
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: 22,
            }}
          >
            {slides.map((slide, i) => (
              <View
                key={slide.id}
                style={{
                  width: i === activeIndex ? 22 : 6,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor:
                    i === activeIndex ? colors.brand : colors.border,
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={goNext}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              backgroundColor: colors.brand,
              paddingVertical: 16,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                color: colors.brandOnBrand,
                fontFamily: "Jakarta-Bold",
                fontSize: 15,
              }}
            >
              {isLastSlide ? "Logga in" : "Nästa"}
            </Text>
            <Ionicons
              name={isLastSlide ? "arrow-forward" : "chevron-forward"}
              size={16}
              color={colors.brandOnBrand}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
};

export default Welcome;
