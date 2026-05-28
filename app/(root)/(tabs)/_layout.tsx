import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import type { SFSymbol } from "sf-symbols-typescript";

import { useTheme } from "@/lib/ThemeContext";

type TabName = "home" | "search" | "library" | "favorites" | "profile";

interface TabConfig {
  name: TabName;
  label: string;
  sf: { default: SFSymbol; selected: SFSymbol };
  ionicon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabConfig[] = [
  {
    name: "home",
    label: "Hem",
    sf: { default: "house", selected: "house.fill" },
    ionicon: "home-outline",
  },
  {
    name: "search",
    label: "Sök",
    sf: { default: "magnifyingglass", selected: "magnifyingglass" },
    ionicon: "search-outline",
  },
  {
    name: "library",
    label: "Bibliotek",
    sf: { default: "books.vertical", selected: "books.vertical.fill" },
    ionicon: "library-outline",
  },
  {
    name: "favorites",
    label: "Favoriter",
    sf: { default: "heart", selected: "heart.fill" },
    ionicon: "heart-outline",
  },
  {
    name: "profile",
    label: "Profil",
    sf: { default: "person", selected: "person.fill" },
    ionicon: "person-outline",
  },
];

export default function Layout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      tintColor={colors.brand}
      iconColor={{
        default: colors.textSubtle,
        selected: colors.brand,
      }}
      labelStyle={{
        default: { color: colors.textSubtle, fontSize: 10 },
        selected: { color: colors.brand, fontSize: 10 },
      }}
      backgroundColor={null}
      disableTransparentOnScrollEdge={false}
    >
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <Icon
            sf={tab.sf}
            androidSrc={
              <VectorIcon family={Ionicons} name={tab.ionicon} />
            }
          />
          <Label>{tab.label}</Label>
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
