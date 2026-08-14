import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import Todo from "./Todo";
import { icons } from "@/constants";

interface ITodo {
  id: string;
  text: string;
  completed: boolean;
}

interface ITodoListProps {
  listId: string;
  data: ITodo[];
  name: string;
  description: string;
  onToggle: (todoId: string, newVal: boolean, listId: string) => void;
  onUnassign: () => void;
}

export default function TodoList({
  listId,
  data,
  name,
  description,
  onToggle,
  onUnassign,
}: ITodoListProps) {
  return (
    <View className="bg-white shadow-md shadow-neutral-400/70 rounded-lg p-4 mb-4">
      <View className="flex-row justify-between">
        <View className="flex-1 pr-2">
          <Text className="text-lg font-bold">{name}</Text>
          <Text className="text-sm text-gray-500">{description}</Text>
        </View>

        {onUnassign && (
          <TouchableOpacity onPress={onUnassign}>
            <Image source={icons.close} className="w-5 h-5 tint-black" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Todo
            data={item}
            onToggle={(id, completed) => onToggle(id, completed, listId)}
          />
        )}
        keyExtractor={(item) => item.id}
        className="mt-2"
      />
    </View>
  );
}
