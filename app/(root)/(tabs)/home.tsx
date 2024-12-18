import React, { useEffect, useState } from "react";
import TodoList from "@/components/Todo/TodoList";
import { icons } from "@/constants";
import { ITodo } from "@/types/type";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [userName, setUserName] = useState<string | null>(null);

  // Mocked Todo Data
  const mockTodoData: ITodo[] = [
    { id: "1", done: false, text: "Gör ditten", color: "#f5f5f5" },
    { id: "2", done: false, text: "Gör datten", color: "#f5f5f5" },
    { id: "3", done: false, text: "Gör färdigt detta", color: "#f5f5f5" },
    { id: "4", done: true, text: "Ät mat", color: "#f5f5f5" },
    { id: "5", done: false, text: "Kom på mer todo's", color: "#f5f5f5" },
  ];

  // Fetch user profile from Microsoft Graph API
  useEffect(() => {
    const loadUserFromGraph = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          router.replace("/(auth)/sign-in");
          return;
        }

        // Fetch user details from Microsoft Graph API
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user data from Graph API");
          router.replace("/(auth)/sign-in");
          return;
        }

        const userData = await response.json();
        setUserName(userData.givenName || "Användare");
        console.log("User Data from Graph:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/(auth)/sign-in");
      }
    };

    loadUserFromGraph();
  }, []);

  // Handle user sign-out
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
      <TodoList data={mockTodoData} />
    </SafeAreaView>
  );
}
