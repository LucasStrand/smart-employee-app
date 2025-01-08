import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants";
import { ApiType } from "@/lib/apiConfig";
import { fetchAPI } from "@/lib/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const loadUserFromGraph = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          console.warn("No token found. Redirecting to sign-in.");
          handleSignOut();
          return;
        }
        const userData = await fetchAPI(
          "/me",
          { method: "GET" },
          ApiType.GRAPH
        );
        console.log("Graph API User Data:", userData);

        setUserName(userData.givenName || "Användare");
      } catch (err) {
        console.error("Error fetching user data:", err);
        handleSignOut();
      }
    };

    loadUserFromGraph();
  }, []);
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };
  return (
    <SafeAreaView>
      <View className="flex flex-row items-center justify-between my-2 px-3">
        <Text className="text-2xl font-JakartaExtraBold">
          Hej {userName || "Användare"} 👋
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="justify-center items-center w-10 h-10 rounded-full bg-white"
        >
          <Image source={icons.out} className="w-4 h-4" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
