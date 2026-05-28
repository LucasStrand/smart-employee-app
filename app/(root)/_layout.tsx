import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";

import { useTheme } from "@/lib/ThemeContext";
import { getAccessToken } from "@/lib/auth";

const Layout = () => {
  const { colors } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    getAccessToken().then((token) => setIsAuthenticated(!!token));
  }, []);

  if (isAuthenticated === null) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="browse-workorders" />
      <Stack.Screen name="category/[id]" />
      <Stack.Screen name="chapter/[id]" />
    </Stack>
  );
};

export default Layout;
