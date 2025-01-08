import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoList from "@/components/Todo/TodoList";
import { fetchAPI } from "@/lib/fetch";
import { ApiType } from "@/lib/apiConfig";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import ReactNativeModal from "react-native-modal";
import CustomButton from "@/components/CustomButton";
import { getRandomEmoji } from "@/lib/getRandomEmoji";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListType {
  id: string;
  name: string;
  description: string;
  todos: Todo[];
}

const Home = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [randomEmoji, setRandomEmoji] = useState<string>("");

  const [todolists, setTodoLists] = useState<TodoListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // For “last item” modal
  const [showLastItemModal, setShowLastItemModal] = useState(false);
  const [pendingTodo, setPendingTodo] = useState<{
    todoId: string;
    listId: string;
  } | null>(null);

  // Load user from Graph
  useEffect(() => {
    const loadUserFromGraph = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          handleSignOut();
          return;
        }
        const userData = await fetchAPI(
          "/me",
          { method: "GET" },
          ApiType.GRAPH
        );
        setUserName(userData.givenName || "Användare");
        setRandomEmoji(getRandomEmoji());
      } catch (err) {
        handleSignOut();
      }
    };
    loadUserFromGraph();
  }, []);

  // Fetch assigned to-do lists
  useEffect(() => {
    const fetchAssignedTodoLists = async () => {
      try {
        const userId = await AsyncStorage.getItem("local_user_id");
        if (!userId) throw new Error("No local_user_id found.");

        const response = await fetchAPI(
          `/assigned-todolist?user_id=${userId}`,
          { method: "GET" }
        );
        setTodoLists(response);
      } catch (err) {
        setError("Failed to load your to-do lists.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedTodoLists();
  }, []);

  // If not last item, just do the toggle. If last item, prompt modal first.
  const attemptToggle = (todoId: string, newValue: boolean, listId: string) => {
    if (!newValue) {
      // user is unchecking a completed item => no confirmation needed
      doToggle(todoId, newValue, listId);
      return;
    }

    // user wants to check a (probably incomplete) item => see if it's last incomplete
    const foundList = todolists.find((l) => l.id === listId);
    if (!foundList) {
      // just do normal toggle
      doToggle(todoId, newValue, listId);
      return;
    }

    // how many are incomplete?
    const incompleteCount = foundList.todos.filter((t) => !t.completed).length;
    if (incompleteCount === 1) {
      // It's the last incomplete => show modal
      setPendingTodo({ todoId, listId });
      setShowLastItemModal(true);
    } else {
      // Just do normal toggle
      doToggle(todoId, newValue, listId);
    }
  };

  // Actually set the item to completed = newValue
  const doToggle = async (todoId: string, newVal: boolean, listId: string) => {
    try {
      // 1) Update the single task in the backend
      await fetchAPI("/todolist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todoId, completed: newVal }),
      });

      // 2) Update local state
      setTodoLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              todos: list.todos.map((todo) =>
                todo.id === todoId ? { ...todo, completed: newVal } : todo
              ),
            };
          }
          return list;
        })
      );

      // 3) If it's newly completed, check if entire list is done => archive
      if (newVal) {
        archiveCheck(listId);
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  // archiveCheck => if entire list is done => archive
  const archiveCheck = (listId: string) => {
    const theList = todolists.find((l) => l.id === listId);
    if (!theList) return;

    const allDone = theList.todos.every((t) => t.completed);
    if (allDone) {
      // call archive
      archiveTodolist(listId);
    }
  };

  // call /archive-todolist
  const archiveTodolist = async (todoListId: string) => {
    try {
      const response = await fetchAPI("/archive-todolist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoListId }),
      });
      if (response?.message === "To-Do list archived successfully") {
        // remove from local state
        setTodoLists((prev) => prev.filter((l) => l.id !== todoListId));
      }
    } catch (error) {
      console.error("Error archiving todo list:", error);
    }
  };

  // user taps close icon => unassign
  const handleUnassign = async (todoListId: string) => {
    try {
      const response = await fetchAPI("/assigned-todolist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoListId }),
      });
      if (response?.message === "Todo list unassigned successfully") {
        const userId = await AsyncStorage.getItem("local_user_id");
        if (!userId) return;
        const updatedLists = await fetchAPI(
          `/assigned-todolist?user_id=${userId}`,
          { method: "GET" }
        );
        setTodoLists(updatedLists);
      }
    } catch (error) {
      console.error("Error unassigning list:", error);
    }
  };

  // user taps "remove" => show remove modal
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeListId, setRemoveListId] = useState<string | null>(null);

  const confirmRemoveList = (listId: string) => {
    setRemoveListId(listId);
    setShowRemoveModal(true);
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
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 p-4 bg-white">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text className="text-blue-500 underline mt-2">
            Logga ut och försök igen
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Greeting + search */}
      <View className="flex flex-row items-center justify-between my-2 px-3">
        <Text className="text-2xl font-bold">
          {userName || "Användare"} Checklistor {randomEmoji}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/browse-workorders")}
          className="w-10 h-10 justify-center items-center rounded-full bg-white"
        >
          <Image source={icons.search} className="w-5 h-5" />
        </TouchableOpacity>
      </View>

      <FlatList
        className="pt-4 px-2"
        contentContainerStyle={{ paddingBottom: 78 }}
        data={todolists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoList
            listId={item.id}
            data={item.todos}
            name={item.name}
            description={item.description}
            // Instead of onToggle => attemptToggle
            onToggle={(todoId: string, newVal: boolean, listId: string) =>
              attemptToggle(todoId, newVal, listId)
            }
            onUnassign={() => confirmRemoveList(item.id)}
          />
        )}
      />

      {/* Remove Modal */}
      <ReactNativeModal isVisible={showRemoveModal}>
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[240px]">
          <Text className="text-2xl font-bold text-center mb-2">
            Ta bort checklista?
          </Text>
          <Text className="text-base text-gray-500 text-center">
            Är du säker på att du vill ta bort denna checklista?
          </Text>

          <View className="flex-row justify-center mt-6">
            <CustomButton
              title="Avbryt"
              bgVariant="outline"
              textVariant="primary"
              onPress={() => {
                setShowRemoveModal(false);
                setRemoveListId(null);
              }}
              className="mx-2"
            />
            <CustomButton
              title="Ta Bort"
              onPress={() => {
                if (removeListId) {
                  handleUnassign(removeListId);
                }
                setShowRemoveModal(false);
                setRemoveListId(null);
              }}
              bgVariant="danger"
              className="mx-2"
            />
          </View>
        </View>
      </ReactNativeModal>

      {/* Last Incomplete Item Modal */}
      <ReactNativeModal isVisible={showLastItemModal}>
        <View className="bg-white px-7 py-9 rounded-2xl min-h-[220px]">
          <Text className="text-2xl font-bold text-center mb-2">
            Markera sista uppgiften?
          </Text>
          <Text className="text-base text-gray-500 text-center">
            Detta är den sista uppgiften i checklistan. Om du fortsätter kommer
            den att markeras som klar och checklistan arkiveras.
          </Text>

          <View className="flex-row justify-center mt-6">
            {/* Avbryt */}
            <CustomButton
              title="Avbryt"
              bgVariant="outline"
              textVariant="primary"
              onPress={() => {
                setPendingTodo(null);
                setShowLastItemModal(false);
              }}
              className="mx-2"
            />
            {/* OK => finalize toggle */}
            <CustomButton
              title="OK"
              bgVariant="success"
              onPress={() => {
                if (pendingTodo) {
                  // Actually do the final toggle now
                  doToggle(pendingTodo.todoId, true, pendingTodo.listId);
                }
                setPendingTodo(null);
                setShowLastItemModal(false);
              }}
              className="mx-2"
            />
          </View>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default Home;
