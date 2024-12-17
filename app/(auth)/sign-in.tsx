import React, { useEffect, useState } from "react";
import { View, ScrollView, Image, Text, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as AuthSession from "expo-auth-session";
import { images, icons } from "@/constants";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";

const SignIn = () => {
  const router = useRouter();

  // Azure AD Configuration
  const CLIENT_ID = "25e06da5-7be9-41d6-b000-ffde4e36069a"; // Replace with your Azure AD app Client ID
  const TENANT_ID = "efacdbb3-8b4e-4d16-8110-4bfb66410cd7"; // Replace with your Azure Tenant ID
  const REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: "exp",
  });
  console.log("Redirect URI:", REDIRECT_URI);
  const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
  const AUTH_URL = `${AUTHORITY}/oauth2/v2.0/authorize`;
  const TOKEN_URL = `${AUTHORITY}/oauth2/v2.0/token`;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      responseType: "code", // Use "code" explicitly for PKCE
      codeChallengeMethod: "S256", // PKCE hashing method
    },
    {
      authorizationEndpoint: AUTH_URL,
      tokenEndpoint: TOKEN_URL,
    }
  );

  const handleSignIn = async () => {
    if (!request) return;

    const result = await promptAsync();

    if (result.type === "success") {
      const tokenResponse = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          scope: "openid profile email",
          code: result.params.code, // Authorization code
          redirect_uri: REDIRECT_URI,
          grant_type: "authorization_code",
          code_verifier: request.codeVerifier, // Dynamically include codeVerifier
        }).toString(),
      });

      const tokenData = await tokenResponse.json();
      console.log("Token Data:", tokenData);

      if (tokenData.error) {
        Alert.alert("Authentication Failed", tokenData.error_description);
      } else {
        console.log("Access Token:", tokenData.access_token);
        router.replace("/(root)/(tabs)/home");
      }
    } else {
      Alert.alert("Authentication Canceled");
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Response:", response);
    }
  }, [response]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.SMFasad} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Välkommen 👋
          </Text>
        </View>

        <View className="p-5">
          <CustomButton title="Logga in med Microsoft" onPress={handleSignIn} />
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
