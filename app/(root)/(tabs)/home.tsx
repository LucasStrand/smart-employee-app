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

const Home = () => {
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

  useEffect(() => {
    const fetchAssignedTodoLists = async () => {
      try {
        const userId = await AsyncStorage.getItem("local_user_id");
        if (!userId) throw new Error("No local_user_id found.");

        const response = await fetchAPI(
          `/assigned-todolist?user_id=${userId}`,
          { method: "GET" },
          ApiType.NEON
        );

        setTodoLists(response);
      } catch (err) {
        console.error("Error fetching assigned to-do lists:", err);
        setError("Failed to load your to-do lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTodoLists();
  }, []);

  const onToggle = async (todoId: string, completed: boolean) => {
    try {
      await fetchAPI(`/todolist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todoId, completed }),
      });

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
};

export default Home;
