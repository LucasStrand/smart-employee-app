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
import { ApiType } from "@/lib/apiConfig";
import { ToDoList } from "@/types/type";

const BrowseWorkOrders = () => {
  const [todolists, setTodolists] = useState<ToDoList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTodolists();
  }, []);

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

  const assignTodoList = async (todoListId: number) => {
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
      } else {
        Alert.alert("Error", "Failed to assign Todo List.");
      }
    } catch (error) {
      console.error("Error assigning todo list:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchTodolists(text);
  };

  return (
    <View>
      {/* Search Bar */}
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search work orders"
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 8,
        }}
      />

      {/* Work Order List */}
      <FlatList
        data={todolists}
        keyExtractor={(item: ToDoList) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {item.name || "Unnamed Work Order"}
            </Text>
            <Text>{item.belongs_to}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity
              onPress={() => assignTodoList(item.id)}
              style={{
                backgroundColor: "blue",
                padding: 10,
                marginTop: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Assign
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default BrowseWorkOrders;
