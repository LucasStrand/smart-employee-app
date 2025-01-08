// import React, { useState } from "react";
// import { FlatList, View, Text, TouchableOpacity, Image } from "react-native";
// import Todo from "./Todo";
// import { icons } from "@/constants";

// interface ITodoListProps {
//   data: { id: string; text: string; completed: boolean }[];
//   name: string;
//   description: string;
//   onToggle: (id: string, completed: boolean) => void;
//   onUnassign?: () => void; // if we want the close icon
// }

// const TodoList = ({
//   data,
//   name,
//   description,
//   onToggle,
//   onUnassign,
// }: ITodoListProps) => {
//   const [expanded, setExpanded] = useState<boolean>(true);

//   // Toggle expanded/collapsed
//   const handleToggleExpand = () => {
//     setExpanded((prev) => !prev);
//   };

//   // Header UI
//   const Header = () => {
//     return (
//       <View className="flex-row justify-between mb-2">
//         {/* Name + Description in a column, but tapable for expand/collapse */}
//         <TouchableOpacity onPress={handleToggleExpand} className="flex-1 pr-2">
//           <Text className="text-lg font-bold">{name}</Text>
//           <Text className="text-sm text-gray-500">{description}</Text>
//         </TouchableOpacity>

//         {onUnassign && (
//           <TouchableOpacity onPress={onUnassign} className="ml-2">
//             <Image source={icons.close} className="w-5 h-5 tint-black" />
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   };

//   if (!expanded) {
//     return (
//       <View className="p-2">
//         <Header />
//         {/* Optionally show some arrow or '...' if you'd like */}
//       </View>
//     );
//   }

//   return (
//     <View className="p-2">
//       <Header />
//       <FlatList
//         data={data}
//         renderItem={({ item }) => <Todo data={item} onToggle={onToggle} />}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// };

// export default TodoList;

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
      {/* Title row */}
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

      {/* Tasks */}
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
