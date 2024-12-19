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
import { fetchAPI, fetchWorkOrders } from "@/lib/fetch";
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

        // Fetch user details from Microsoft Graph API
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error("Graph API call failed. Logging out...");
          handleSignOut();
          return;
        }

        const userData = await response.json();
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
      const response = await fetchAPI(`/todos/${todoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todoId, completed }),
      });

      console.log("PATCH Response:", response);

      // Update local state
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

  // Sync work orders and fetch to-do lists
  useEffect(() => {
    const syncWorkOrdersAndFetchLists = async () => {
      try {
        const workorders = await fetchWorkOrders();
        console.log("Fetched Work Orders:", workorders);

        await fetchAPI("/(api)/todolist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ workorders }),
        });

        const response = await fetchAPI("/(api)/todolist", { method: "GET" });
        console.log("Fetched To-Do Lists:", response);

        if (Array.isArray(response)) {
          setTodoLists(response);
        } else {
          throw new Error("Unexpected API response format.");
        }
      } catch (err) {
        console.error(
          "Error syncing work orders or fetching to-do lists:",
          err
        );
        setError("Failed to load to-do lists.");
      } finally {
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
