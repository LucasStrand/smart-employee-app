import React from "react";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { GlassView } from "@/components/glass/GlassView";

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  focused: boolean;
  iconName: IconName;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, iconName, label }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 6,
        gap: 3,
        minWidth: 56,
      }}
    >
      <View
        style={{
          width: 38,
          height: 30,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: focused ? colors.brandGlow : "transparent",
          borderWidth: focused ? 1 : 0,
          borderColor: colors.borderBrand,
        }}
      >
        <Ionicons
          name={iconName}
          size={20}
          color={focused ? colors.brand : colors.textSubtle}
        />
      </View>
      <Text
        style={{
          fontSize: 10,
          fontFamily: focused ? "Jakarta-Bold" : "Jakarta-Medium",
          color: focused ? colors.brand : colors.textSubtle,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const TabBarBackground: React.FC = () => {
  const { colors, mode } = useTheme();
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <GlassView
        intensity={Platform.OS === "ios" ? "thick" : "regular"}
        tintOpacity={mode === "dark" ? 0.18 : 0.08}
        style={StyleSheet.absoluteFillObject}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: colors.glassBorder,
            },
          ]}
        />
      </GlassView>
    </View>
  );
};

export default function Layout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: Platform.OS === "ios" ? 24 : 18,
          height: 70,
          borderRadius: 28,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarItemStyle: { height: 70 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" label="Hem" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="search" label="Sök" />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="library" label="Bibliotek" />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="heart" label="Favoriter" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="person" label="Profil" />
          ),
        }}
      />
    </Tabs>
  );
}
