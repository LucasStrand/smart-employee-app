import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { Background } from "@/components/playbook/Background";
import { LogoMark } from "@/components/playbook/LogoMark";

const SignIn = () => {
  const router = useRouter();
  const { colors, mode } = useTheme();

  const CLIENT_ID = "25e06da5-7be9-41d6-b000-ffde4e36069a";
  const TENANT_ID = "efacdbb3-8b4e-4d16-8110-4bfb66410cd7";
  const REDIRECT_URI = AuthSession.makeRedirectUri({ scheme: "exp" });

  const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
  const AUTH_URL = `${AUTHORITY}/oauth2/v2.0/authorize`;
  const TOKEN_URL = `${AUTHORITY}/oauth2/v2.0/token`;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email", "User.Read"],
      responseType: "code",
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    {
      authorizationEndpoint: AUTH_URL,
      tokenEndpoint: TOKEN_URL,
    }
  );

  const handleSignIn = async () => {
    if (!request) return;

    const result = await promptAsync();
    if (result.type !== "success") {
      Alert.alert("Inloggning avbruten");
      return;
    }

    try {
      const tokenBody = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: "openid profile email User.Read",
        code: result.params.code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      });
      if (request.codeVerifier) tokenBody.set("code_verifier", request.codeVerifier);

      const tokenResponse = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenBody.toString(),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) {
        Alert.alert("Inloggningen misslyckades", tokenData.error_description);
        return;
      }

      const idToken = tokenData.id_token;
      const decodedToken = JSON.parse(atob(idToken.split(".")[1]));

      await AsyncStorage.setItem("access_token", tokenData.access_token);

      const upsertRes = await fetchAPI("/(api)/user", {
        method: "POST",
        body: JSON.stringify({
          name: decodedToken.name || "Unknown User",
          email:
            decodedToken.email || decodedToken.preferred_username || "No Email",
          azureAdId: decodedToken.sub,
          role: "employee",
        }),
      });

      if (upsertRes && upsertRes.userId) {
        await AsyncStorage.setItem("local_user_id", String(upsertRes.userId));
      } else {
        await AsyncStorage.setItem("local_user_id", "3");
      }

      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Error during sign-in:", error);
      Alert.alert("Fel", "Något gick fel vid inloggningen.");
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      // eslint-disable-next-line no-console
      console.log("Response:", response);
    }
  }, [response]);

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero image */}
          <View
            style={{
              height: 280,
              marginHorizontal: 20,
              marginTop: 14,
              borderRadius: 26,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Image
              source={images.SMFasad}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                backgroundColor: colors.overlayScrim,
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 18,
                left: 18,
              }}
            >
              <LogoMark
                size={40}
                showWordmark
                wordmark="Smart Teknik"
                subtitle="Standard"
              />
            </View>
            <View
              style={{
                position: "absolute",
                left: 18,
                right: 18,
                bottom: 18,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Jakarta-ExtraBold",
                  fontSize: 26,
                  letterSpacing: -0.6,
                }}
              >
                Välkommen tillbaka
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "Jakarta",
                  fontSize: 13.5,
                  marginTop: 4,
                  maxWidth: 320,
                  lineHeight: 20,
                }}
              >
                Logga in med ditt Microsoft-konto för att komma åt manualen,
                checklistor och arbetsordrar.
              </Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: 26, flex: 1 }}>
            {/* Highlights */}
            <Text
              style={{
                color: colors.textSubtle,
                fontFamily: "Jakarta-Bold",
                fontSize: 11,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Det här finns i appen
            </Text>
            <View style={{ gap: 10 }}>
              <Highlight
                icon="book-outline"
                title="Hela vår standard"
                description="16 kapitel om hur vi arbetar – från projektfas till överlämning."
              />
              <Highlight
                icon="git-network-outline"
                title="Kabel- och nätverksregler"
                description="Märkstandard, separation, färgkoder och rackstandard."
              />
              <Highlight
                icon="clipboard-outline"
                title="Arbetsordrar"
                description="Tilldelade uppgifter och checklistor från projektledning."
              />
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 20,
              paddingBottom: 28,
              paddingTop: 24,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSignIn}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                backgroundColor: colors.brand,
                paddingVertical: 16,
                borderRadius: 999,
              }}
            >
              <Ionicons
                name="logo-microsoft"
                size={18}
                color={colors.brandOnBrand}
              />
              <Text
                style={{
                  color: colors.brandOnBrand,
                  fontFamily: "Jakarta-Bold",
                  fontSize: 15,
                }}
              >
                Logga in med Microsoft
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: colors.textSubtle,
                fontFamily: "Jakarta",
                fontSize: 12,
                textAlign: "center",
                marginTop: 14,
                paddingHorizontal: 30,
                lineHeight: 18,
              }}
            >
              Genom att logga in godkänner du Smart Tekniks interna
              användarvillkor för manualer och arbetsordrar.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

const Highlight: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        borderRadius: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: colors.brandGlow,
          borderWidth: 1,
          borderColor: colors.borderBrand,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={colors.brand} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: "Jakarta-Bold",
            fontSize: 14.5,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: "Jakarta",
            fontSize: 12.5,
            marginTop: 2,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
