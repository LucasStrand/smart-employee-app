import TodoList from "@/components/Todo/TodoList";
import { icons } from "@/constants";
import { ITodo } from "@/types/type";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const mockTodoData: ITodo[] = [
    {
      id: "1",
      done: false,
      text: "Gör ditten",
      color: "#f5f5f5",
    },
    {
      id: "2",
      done: false,
      text: "Gör datten",
      color: "#f5f5f5",
    },
    {
      id: "3",
      done: false,
      text: "Gör färdigt detta",
      color: "#f5f5f5",
    },
    {
      id: "4",
      done: true,
      text: "Ät mat",
      color: "#f5f5f5",
    },
    {
      id: "5",
      done: false,
      text: "kom på mer todo's",
      color: "#f5f5f5",
    },
  ];

  const { user } = useUser();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <SafeAreaView>
      <View className="flex flex-row items-center justify-between my-2 px-3">
        <Text className="text-2xl font-JakartaExtraBold">
          Hej {user?.fullName}👋
        </Text>
        <TouchableOpacity
          onPress={handleSignOut}
          className="justify-center items-center w-10 h-10 rounded-full bg-white"
        >
          <Image source={icons.out} className="w-4 h-4" />
        </TouchableOpacity>
      </View>
      <TodoList data={mockTodoData} />
    </SafeAreaView>
  );
}
