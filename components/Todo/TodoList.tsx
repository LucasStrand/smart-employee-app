import React from "react";
import { FlatList, View, Text } from "react-native";
import Todo from "./Todo";

interface ITodoListProps {
  data: { id: string; text: string; completed: boolean }[];
  name: string;
  description: string;
  onToggle: (id: string, completed: boolean) => void;
}

const TodoList = (props: ITodoListProps) => {
  const { data, name, description, onToggle } = props;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Todo data={item} onToggle={onToggle} />}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text className="text-xl font-JakartaBold">{name}</Text>
          <Text className="text-sm text-gray-600">{description}</Text>
        </>
      }
    />
  );
};

export default TodoList;
