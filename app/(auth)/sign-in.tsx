import React, { useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { images } from "@/constants";
import { setAccessToken } from "@/lib/auth";
import { fetchAPI } from "@/lib/fetch";
import { Background } from "@/components/playbook/Background";

const SignIn = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { colors, mode } = useTheme();
  const logoSource = mode === "dark" ? images.logoWhite : images.logo;

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

      await setAccessToken(tokenData.access_token);

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
                paddingHorizontal: 12,
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

export default SignIn;
