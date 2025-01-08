import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAPI } from "@/lib/fetch";
import { ToDoList } from "@/types/type";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";

const BrowseWorkOrders = () => {
  const [todolists, setTodolists] = useState<ToDoList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 1) Initial load of to-do lists
  useEffect(() => {
    fetchTodolists();
  }, []);

  // 2) Fetch from /todolist
  const fetchTodolists = async (query: string = "") => {
    try {
      const response = await fetchAPI(`/todolist?query=${query}&limit=50`, {
        method: "GET",
      });
      setTodolists(response);
    } catch (error) {
      console.error("Error fetching todolists:", error);
    }
  };

  // 3) Assign a to-do list, then refresh
  const assignTodoList = async (todoListId: string) => {
    try {
      const userId = await AsyncStorage.getItem("local_user_id");
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        return;
      }

      const response = await fetchAPI(`/assigned-todolist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoListId, userId }),
      });

      if (response?.message === "Todo List assigned successfully") {
        Alert.alert("Success", "Todo List assigned successfully!");
        fetchTodolists(searchQuery);
      } else {
        Alert.alert("Error", "Failed to assign Todo List.");
      }
    } catch (error) {
      console.error("Error assigning todo list:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  // 4) Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchTodolists(text);
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      {/* Search Bar */}
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search work orders"
        className="h-10 border border-gray-400 px-2 mb-3"
      />

      {/* Work Order List */}
      <FlatList
        data={todolists}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-3 border-b border-gray-300">
            <Text className="font-bold">
              {item.name || "Unnamed Work Order"}
            </Text>
            <Text>{item.belongs_to}</Text>
            <Text>{item.description}</Text>

            {item.user_id !== null ? (
              /* If assigned => red button, text "Upptaget" */
              <CustomButton
                onPress={() => {}}
                title="Upptagen"
                bgVariant="danger"
                className="mt-2"
                disabled
              />
            ) : (
              /* If not assigned => normal "Skapa checklista" button */
              <CustomButton
                onPress={() => assignTodoList(item.id)}
                title="Checklista"
                className="mt-2"
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default BrowseWorkOrders;
