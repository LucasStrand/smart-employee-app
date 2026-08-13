import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "../assets/global.css";
import { getValidAccessToken } from "@/lib/auth";
import { ThemeProvider, useTheme } from "@/lib/ThemeContext";
import { BookmarksProvider } from "@/lib/useBookmarks";

SplashScreen.preventAutoHideAsync();

const LoadingScreen: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.bg,
      }}
    >
      <ActivityIndicator size="large" color={colors.brand} />
    </View>
  );
};

const RootStack: React.FC = () => {
  const { colors, mode } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.bg },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </View>
  );
};

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    "Jakarta-Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    Jakarta: require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  useEffect(() => {
    const loadSession = async () => {
      // Drops expired tokens before auth gates run.
      await getValidAccessToken();
      setIsLoading(false);
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BookmarksProvider>
            <RootStack />
          </BookmarksProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
