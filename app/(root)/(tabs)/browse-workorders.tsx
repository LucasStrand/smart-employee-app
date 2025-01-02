import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { fetchAPI } from "@/lib/fetch";
// 1) Import ApiType so we can specify NEON calls explicitly
import { ApiType } from "@/lib/apiConfig";
import { ToDoList } from "@/types/type";

const BrowseWorkOrders = () => {
  const [todolists, setTodolists] = useState<ToDoList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTodolists = async (query: string = "") => {
    try {
      // 2) Add ApiType.NEON as the third argument
      const response = await fetchAPI(
        `/todolist?query=${query}&limit=20`,
        { method: "GET" },
        ApiType.NEON
      );
      setTodolists(response);
    } catch (error) {
      console.error("Error fetching todolists:", error);
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
          <TouchableOpacity>
            <View
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {item.name || "Unnamed Work Order"}
                <Text>{item.description}</Text>
              </Text>
              <Text>{item.belongs_to}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default BrowseWorkOrders;
