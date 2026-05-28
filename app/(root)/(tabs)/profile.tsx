import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { ApiType } from "@/lib/apiConfig";
import { fetchAPI } from "@/lib/fetch";
import { clearSession } from "@/lib/auth";

import { Background } from "@/components/playbook/Background";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";

type IconName = keyof typeof Ionicons.glyphMap;

interface UserData {
  name: string;
  email: string;
}

const Profile = () => {
  const router = useRouter();
  const { colors, mode, appearance, setAppearance } = useTheme();

  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return;
        const data = await fetchAPI("/me", { method: "GET" }, ApiType.GRAPH);
        setUser({
          name: data?.displayName || data?.givenName || "Användare",
          email: data?.mail || data?.userPrincipalName || "",
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleSignOut = async () => {
    try {
      await clearSession();
      router.replace("/(auth)/welcome");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScreenHeader
          eyebrow="Konto"
          title="Inställningar"
          subtitle="Personalisera utseende, aviseringar och tillgänglighet."
        />

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 6,
            paddingBottom: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* User card */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 16,
              borderRadius: 18,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 22,
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                backgroundColor: colors.brandGlow,
                borderWidth: 1,
                borderColor: colors.borderBrand,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.brand,
                  fontFamily: "Jakarta-ExtraBold",
                  fontSize: 22,
                }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "?"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: "Jakarta-Bold",
                  fontSize: 17,
                  letterSpacing: -0.2,
                }}
                numberOfLines={1}
              >
                {user?.name ?? "Användare"}
              </Text>
              {user?.email ? (
                <Text
                  style={{
                    color: colors.textSubtle,
                    fontFamily: "Jakarta",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                  numberOfLines={1}
                >
                  {user.email}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Appearance section */}
          <Section title="Utseende">
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <AppearanceTile
                label="System"
                icon="phone-portrait-outline"
                active={appearance === "system"}
                onPress={() => setAppearance("system")}
              />
              <AppearanceTile
                label="Mörkt"
                icon="moon-outline"
                active={appearance === "dark"}
                onPress={() => setAppearance("dark")}
              />
              <AppearanceTile
                label="Ljust"
                icon="sunny-outline"
                active={appearance === "light"}
                onPress={() => setAppearance("light")}
              />
            </View>
            <Text
              style={{
                color: colors.textSubtle,
                fontFamily: "Jakarta",
                fontSize: 12,
                marginTop: 4,
              }}
            >
              {mode === "dark"
                ? "Mörkt läge är aktivt."
                : "Ljust läge är aktivt."}
            </Text>
          </Section>

          {/* Preferences */}
          <Section title="Inställningar">
            <Row
              icon="notifications-outline"
              label="Aviseringar"
              hint="När nya kapitel publiceras"
              right={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{
                    false: colors.surfaceMuted,
                    true: colors.brand,
                  }}
                  thumbColor="#fff"
                />
              }
            />
            <Row
              icon="cloud-download-outline"
              label="Offline-läge"
              hint="Spara manualen lokalt"
              right={
                <Switch
                  value={offline}
                  onValueChange={setOffline}
                  trackColor={{
                    false: colors.surfaceMuted,
                    true: colors.brand,
                  }}
                  thumbColor="#fff"
                />
              }
            />
          </Section>

          {/* General */}
          <Section title="Allmänt">
            <Row
              icon="information-circle-outline"
              label="Om vår manual"
              hint="Version 4.0"
              onPress={() =>
                Alert.alert(
                  "Smart Teknik Standard",
                  "Version 4.0\nIntern arbetsstandard för projekt, nätverk, kabelmärkning och rackbyggnad."
                )
              }
            />
            <Row
              icon="help-circle-outline"
              label="Hjälp & support"
              hint="Hör av dig till oss"
              onPress={() => {}}
            />
            <Row
              icon="mail-outline"
              label="Skicka feedback"
              hint="Hjälp oss göra appen bättre"
              onPress={() => {}}
            />
          </Section>

          {/* Sign out */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSignOut}
            style={{
              marginTop: 14,
              padding: 16,
              borderRadius: 16,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              flexDirection: "row",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text
              style={{
                color: colors.danger,
                fontFamily: "Jakarta-Bold",
                fontSize: 14,
              }}
            >
              Logga ut
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const Section: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 22 }}>
      <Text
        style={{
          color: colors.textSubtle,
          fontFamily: "Jakarta-Bold",
          fontSize: 11,
          letterSpacing: 1.1,
          textTransform: "uppercase",
          marginBottom: 10,
          paddingLeft: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
};

const Row: React.FC<{
  icon: IconName;
  label: string;
  hint?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}> = ({ icon, label, hint, right, onPress }) => {
  const { colors } = useTheme();
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: colors.surfaceMuted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={colors.text} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-SemiBold",
            fontSize: 14.5,
          }}
        >
          {label}
        </Text>
        {hint && (
          <Text
            style={{
              color: colors.textSubtle,
              fontFamily: "Jakarta",
              fontSize: 12,
              marginTop: 1,
            }}
          >
            {hint}
          </Text>
        )}
      </View>
      {right ?? (
        onPress && (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textSubtle}
          />
        )
      )}
    </Container>
  );
};

const AppearanceTile: React.FC<{
  label: string;
  icon: IconName;
  active: boolean;
  onPress: () => void;
}> = ({ label, icon, active, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        padding: 14,
        borderRadius: 16,
        backgroundColor: active ? colors.brandGlow : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.borderBrand : colors.border,
        alignItems: "center",
        gap: 8,
      }}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? colors.brand : colors.textMuted}
      />
      <Text
        style={{
          color: active ? colors.brand : colors.textMuted,
          fontFamily: active ? "Jakarta-Bold" : "Jakarta-SemiBold",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Profile;
