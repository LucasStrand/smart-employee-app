import React, { useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { onboarding } from "@/constants";
import { Background } from "@/components/playbook/Background";
import { LogoMark } from "@/components/playbook/LogoMark";

const slides = [
  {
    id: 1,
    eyebrow: "Smart Teknik",
    title: "Vår samlade standard",
    description:
      "Manualen som beskriver hur vi planerar, projekterar, installerar, märker, bygger och lämnar över.",
    image: onboarding[0].image,
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
];

const Welcome = () => {
  const { width } = useWindowDimensions();
  const { colors, mode } = useTheme();
  const flatListRef = useRef<FlatList<(typeof slides)[number]>>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === slides.length - 1;

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const goNext = () => {
    if (isLastSlide) {
      router.replace("/(auth)/sign-in");
      return;
    }
    flatListRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* Top bar */}
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

        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={slides}
            horizontal
            pagingEnabled
            bounces={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            renderItem={({ item }) => (
              <View
                style={{
                  width,
                  paddingHorizontal: 24,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Image stage */}
                <View
                  style={{
                    width: width - 60,
                    height: width - 80,
                    borderRadius: 32,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    marginTop: 20,
                  }}
                >
                  {/* Decorative blobs */}
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      top: -50,
                      right: -50,
                      width: 200,
                      height: 200,
                      borderRadius: 999,
                      backgroundColor: colors.brand,
                      opacity: mode === "dark" ? 0.12 : 0.08,
                    }}
                  />
                  <View
                    pointerEvents="none"
                    style={{
                      position: "absolute",
                      bottom: -60,
                      left: -60,
                      width: 220,
                      height: 220,
                      borderRadius: 999,
                      backgroundColor: colors.brand,
                      opacity: mode === "dark" ? 0.05 : 0.04,
                    }}
                  />
                  <Image
                    source={item.image}
                    style={{
                      width: "85%",
                      height: "85%",
                      resizeMode: "contain",
                    }}
                  />
                </View>

                <Text
                  style={{
                    color: colors.brand,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 11,
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                    marginTop: 28,
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
            )}
          />
        </View>

        {/* Dots + CTA */}
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
