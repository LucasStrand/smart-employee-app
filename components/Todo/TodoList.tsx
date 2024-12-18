import React from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import { ITodo } from "@/types/type";
import Todo from "./Todo";

import { icons } from "@/constants";
interface ITodoListProps {
  data: ITodo[];
}

const TodoList = (props: ITodoListProps) => {
  return (
    <FlatList
      className="h-[500px] w-full flex flex-col p-2 overflow-scroll px-3"
      data={props.data}
      renderItem={({ item }) => <Todo data={item} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <View className="flex flex-row items-center justify-between my-2">
            <Text className="text-2xl font-JakartaExtraBold">
              todo_lists.name here
            </Text>
          </View>
          <Text className="text-xl font-JakartaSemiBold mb-5">
            todo_lists.description here
          </Text>
        </>
      }
    />
  );
};

export default TodoList;
