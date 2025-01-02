import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "@/components/Todo/TodoList";

// 1) Import your new fetchAPI and ApiType
import { fetchAPI } from "@/lib/fetch";
import { ApiType } from "@/lib/apiConfig";

import { icons } from "@/constants";
import { router } from "expo-router";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoList {
  id: string;
  name: string;
  description: string;
  todos: Todo[];
}

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);
  const [todolists, setTodoLists] = useState<TodoList[]>([]);
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

        // Use fetchAPI + ApiType.GRAPH for Microsoft Graph
        // If EXPO_PUBLIC_GRAPH_API is "https://graph.microsoft.com/v1.0",
        // this will call that endpoint and pass the token automatically
        const graphUrl = `${process.env.EXPO_PUBLIC_GRAPH_API}`;
        const userData = await fetchAPI(
          graphUrl,
          { method: "GET" },
          ApiType.GRAPH
        );

        // If the call fails, fetchAPI will throw, jumping to catch below
        console.log("Graph API User Data:", userData);

        setUserName(userData.givenName || "Användare");
      } catch (err) {
        console.error("Error fetching user data:", err);
        handleSignOut();
      }
    };

    loadUserFromGraph();
  }, []);

  // Toggle todo completion
  const onToggle = async (todoId: string, completed: boolean) => {
    try {
      // Neon call (default is NEON, but we'll specify for clarity)
      await fetchAPI(
        `/todolist`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: todoId, completed }),
        },
        ApiType.NEON
      );

      // Update state
      setTodoLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          todos: list.todos.map((todo) =>
            todo.id === todoId ? { ...todo, completed } : todo
          ),
        }))
      );
    } catch (err) {
      console.error("Error updating todo:", err);
      alert("Failed to update the todo. Please try again.");
    }
  };

  // Sync work orders and fetch assigned to-do lists
  useEffect(() => {
    const syncWorkOrdersAndFetchLists = async () => {
      try {
        // 1) Fetch active work orders from Next API
        //    (requires ApiType.NEXT for baseURL + token from .env)
        const activeWorkOrders = await fetchAPI(
          `workorder/?filter_str=${encodeURIComponent(
            JSON.stringify({
              statuscode__ge: 40,
              statuscode__lt: 90,
            })
          )}`,
          { method: "GET" },
          ApiType.NEXT
        );
        console.log(activeWorkOrders);

        // 2) Sync those work orders with your Neon backend
        //    (ApiType.NEON, no .env required)
        await fetchAPI(
          "/todolist",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workorders: activeWorkOrders.items }),
          },
          ApiType.NEON
        );

        // 3) Fetch all assigned to-do lists (again, Neon by default)
        const response = await fetchAPI(
          "/todolist?user_id=3",
          { method: "GET" },
          ApiType.NEON
        );
        setTodoLists(response);
      } catch (error) {
        console.error(
          "Error syncing work orders or fetching to-do lists:",
          error
        );
      } finally {
        // We can safely setLoading(false) here
        setLoading(false);
      }
    };

    syncWorkOrdersAndFetchLists();
  }, []);

  // Handle user logout
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text className="text-blue-500 underline">
            Logga ut och försök igen
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      {/* Greeting and Logout Button */}
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

      {/* To-Do Lists */}
      <View>
        <Text className="text-2xl font-JakartaBold mt-5 px-3">To-Do Lists</Text>
        {(todolists || []).map((list) => (
          <TodoList
            key={list.id}
            data={list.todos}
            name={list.name}
            description={list.description}
            onToggle={onToggle}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}
