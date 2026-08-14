import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { ApiType } from "@/lib/apiConfig";
import { fetchAPI } from "@/lib/fetch";
import { clearSession, getValidAccessToken } from "@/lib/auth";
import { fetchGraphPhoto } from "@/lib/graphPhoto";
import { SUPPORT_EMAIL } from "@/lib/support";
import { manualMeta } from "@/lib/manual";

import { CollapsibleScreen } from "@/components/playbook/CollapsibleScreen";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";

type IconName = keyof typeof Ionicons.glyphMap;

interface UserData {
  name: string;
  email: string;
  photoUri?: string | null;
}

const Profile = () => {
  const router = useRouter();
  const { colors, mode, appearance, setAppearance } = useTheme();

  const [user, setUser] = useState<UserData | null>(null);

  const openMail = async (subject: string) => {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert("E-post", `Skicka till ${SUPPORT_EMAIL}`);
      return;
    }
    await Linking.openURL(url);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await getValidAccessToken();
        if (!token) return;
        const [data, photoUri] = await Promise.all([
          fetchAPI("/me", { method: "GET" }, ApiType.GRAPH),
          fetchGraphPhoto(),
        ]);
        setUser({
          name: data?.displayName || data?.givenName || "Användare",
          email: data?.mail || data?.userPrincipalName || "",
          photoUri,
        });
      } catch {
        // 401 clears session + redirects via fetchAPI
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
    <CollapsibleScreen
      header={<ScreenHeader title="Profil" />}
      scrollProps={{
        contentContainerStyle: {
          paddingHorizontal: 20,
          paddingTop: 8,
        },
      }}
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
                overflow: "hidden",
              }}
            >
              {user?.photoUri ? (
                <Image
                  source={{ uri: user.photoUri }}
                  style={{ width: 56, height: 56 }}
                  accessibilityLabel="Profilbild"
                />
              ) : (
                <Text
                  style={{
                    color: colors.brand,
                    fontFamily: "Jakarta-ExtraBold",
                    fontSize: 22,
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </Text>
              )}
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
          <Section title="Utseende" framed={false}>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
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
                lineHeight: 18,
                marginTop: 12,
                paddingHorizontal: 4,
              }}
            >
              {appearance === "system"
                ? mode === "dark"
                  ? "Följer enheten · mörkt just nu"
                  : "Följer enheten · ljust just nu"
                : appearance === "dark"
                  ? "Mörkt läge är valt."
                  : "Ljust läge är valt."}
            </Text>
          </Section>

          {/* General */}
          <Section title="Allmänt">
            <Row
              icon="information-circle-outline"
              label="Om vår manual"
              hint={manualMeta.version}
              onPress={() =>
                Alert.alert(
                  manualMeta.title,
                  `${manualMeta.version}\nIntern arbetsstandard för projekt, nätverk, kabelmärkning och rackbyggnad.`
                )
              }
            />
            <Row
              icon="help-circle-outline"
              label="Hjälp & support"
              hint={SUPPORT_EMAIL}
              onPress={() => openMail("Support — Smart Employee App")}
            />
            <Row
              icon="mail-outline"
              label="Skicka feedback"
              hint="Hjälp oss göra appen bättre"
              onPress={() => openMail("Feedback — Smart Employee App")}
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
    </CollapsibleScreen>
  );
};

const Section: React.FC<{
  title: string;
  framed?: boolean;
  children: React.ReactNode;
}> = ({ title, framed = true, children }) => {
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
      {framed ? (
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
      ) : (
        children
      )}
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
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderRadius: 16,
        backgroundColor: active ? colors.brandGlow : colors.surface,
        borderWidth: 1,
        borderColor: active ? colors.borderBrand : colors.border,
        alignItems: "center",
        gap: 10,
        minHeight: 88,
        justifyContent: "center",
      }}
    >
      <Ionicons
        name={icon}
        size={22}
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
