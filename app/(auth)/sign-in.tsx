import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as AuthSession from "expo-auth-session";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { images } from "@/constants";
import {
  AUTH_SCOPE_STRING,
  AUTH_SCOPES,
  AZURE_CLIENT_ID,
  AZURE_DISCOVERY_URL,
} from "@/lib/authConfig";
import { setLocalUserId, setSessionTokens } from "@/lib/auth";
import { parseJwtPayload } from "@/lib/jwt";
import { ApiType } from "@/lib/apiConfig";
import { fetchAPI } from "@/lib/fetch";
import { Background } from "@/components/playbook/Background";

const SignIn = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, mode } = useTheme();
  const logoSource = mode === "dark" ? images.logoWhite : images.logo;

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "smart-employee-app",
    path: "auth",
  });
  const discovery = AuthSession.useAutoDiscovery(AZURE_DISCOVERY_URL);

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AZURE_CLIENT_ID,
      redirectUri,
      scopes: [...AUTH_SCOPES],
      responseType: "code",
      extraParams: {
        prompt: "select_account",
      },
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    discovery
  );

  const handleSignIn = async () => {
    if (!AZURE_CLIENT_ID) {
      Alert.alert(
        "Saknad konfiguration",
        "EXPO_PUBLIC_AZURE_CLIENT_ID och EXPO_PUBLIC_AZURE_TENANT_ID måste sättas i .env."
      );
      return;
    }
    if (!request || !discovery?.tokenEndpoint) return;

    const result = await promptAsync();
    if (result.type !== "success") {
      Alert.alert("Inloggning avbruten");
      return;
    }

    try {
      const tokenBody = new URLSearchParams({
        client_id: AZURE_CLIENT_ID,
        scope: AUTH_SCOPE_STRING,
        code: result.params.code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      });
      if (request.codeVerifier) {
        tokenBody.set("code_verifier", request.codeVerifier);
      }

      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenBody.toString(),
      });

      const tokenData = await tokenResponse.json();
      if (tokenData.error) {
        Alert.alert("Inloggningen misslyckades", tokenData.error_description);
        return;
      }

      const idToken = tokenData.id_token as string | undefined;
      const decodedToken = idToken ? parseJwtPayload(idToken) : null;
      if (!decodedToken) {
        Alert.alert("Inloggningen misslyckades", "Kunde inte läsa id-token.");
        return;
      }

      await setSessionTokens({
        accessToken: tokenData.access_token,
        idToken: tokenData.id_token,
        refreshToken: tokenData.refresh_token,
      });

      try {
        const upsertRes = await fetchAPI(
          "/user",
          {
            method: "POST",
            body: JSON.stringify({
              name: decodedToken.name || "Unknown User",
              email:
                decodedToken.email ||
                decodedToken.preferred_username ||
                "No Email",
              azureAdId: decodedToken.oid || decodedToken.sub,
              role: "employee",
            }),
          },
          ApiType.NEON,
          { resetOnUnauthorized: false }
        );

        if (upsertRes?.userId) {
          await setLocalUserId(String(upsertRes.userId));
        } else {
          Alert.alert(
            "Profilen synkades inte",
            "Du är inloggad, men arbetsordrar kan saknas tills du loggar in igen."
          );
        }
      } catch {
        Alert.alert(
          "Profilen synkades inte",
          "Du är inloggad, men arbetsordrar kan saknas tills du loggar in igen."
        );
      }

      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.error("Error during sign-in:", error);
      Alert.alert("Fel", "Något gick fel vid inloggningen.");
    }
  };

  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 28,
            paddingBottom: 28,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 24,
              paddingBottom: 32,
            }}
          >
            <Image
              source={logoSource}
              style={{
                width: width - 56,
                height: (width - 56) * 0.55,
                maxWidth: 420,
                maxHeight: 220,
                resizeMode: "contain",
              }}
            />

            <Text
              style={{
                color: colors.text,
                fontFamily: "Jakarta-ExtraBold",
                fontSize: 28,
                letterSpacing: -0.6,
                textAlign: "center",
                marginTop: 36,
              }}
            >
              Välkommen tillbaka
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: "Jakarta",
                fontSize: 15,
                lineHeight: 22,
                textAlign: "center",
                marginTop: 10,
                maxWidth: 340,
              }}
            >
              Logga in med ditt Microsoft-konto för att komma åt manualen,
              checklistor och arbetsordrar.
            </Text>
          </View>

          <View style={{ paddingTop: 8 }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleSignIn}
              disabled={!request}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                backgroundColor: colors.brand,
                paddingVertical: 16,
                borderRadius: 999,
                opacity: request ? 1 : 0.6,
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
                paddingHorizontal: 12,
                lineHeight: 18,
              }}
            >
              Genom att logga in godkänner du Smart Tekniks interna
              användarvillkor för manualer och arbetsordrar.
            </Text>
            {__DEV__ ? (
              <Text
                selectable
                style={{
                  color: colors.textSubtle,
                  fontFamily: "Jakarta",
                  fontSize: 11,
                  textAlign: "center",
                  marginTop: 12,
                  paddingHorizontal: 8,
                  lineHeight: 16,
                }}
              >
                Entra redirect URI (måste matcha exakt):{"\n"}
                {redirectUri}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
};

export default SignIn;
