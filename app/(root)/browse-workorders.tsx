import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/lib/ThemeContext";
import { fetchAPI } from "@/lib/fetch";
import { getLocalUserId } from "@/lib/auth";
import { ToDoList } from "@/types/type";

import { CollapsibleScreen } from "@/components/playbook/CollapsibleScreen";
import { ScreenHeader } from "@/components/playbook/ScreenHeader";
import { SearchBar } from "@/components/playbook/SearchBar";
import { Pill } from "@/components/playbook/Pill";

const BrowseWorkOrders = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const [todolists, setTodolists] = useState<ToDoList[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  useEffect(() => {
    getLocalUserId().then(setMyUserId);
    fetchTodolists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTodolists = async (query: string = "") => {
    try {
      setLoading(true);
      const response = await fetchAPI(`/todolist?query=${query}&limit=50`, {
        method: "GET",
      });
      setTodolists(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching todolists:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignTodoList = async (todoListId: string) => {
    try {
      const response = await fetchAPI(`/assigned-todolist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoListId }),
      });
      if (response?.message === "Todo List assigned successfully") {
        Alert.alert("Klart", "Arbetsordern är tilldelad till dig.");
        fetchTodolists(searchQuery);
      } else {
        Alert.alert("Fel", "Kunde inte tilldela arbetsordern.");
      }
    } catch (error) {
      console.error("Error assigning todo list:", error);
      Alert.alert("Fel", "Ett oväntat fel uppstod.");
    }
  };

  const unassignTodoList = async (todoListId: string) => {
    try {
      const response = await fetchAPI(`/assigned-todolist`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoListId }),
      });
      if (response?.message === "Todo list unassigned successfully") {
        fetchTodolists(searchQuery);
      } else {
        Alert.alert("Fel", "Kunde inte ta bort tilldelningen.");
      }
    } catch (error) {
      console.error("Error unassigning todo list:", error);
      Alert.alert("Fel", "Ett oväntat fel uppstod.");
    }
  };

  const isTaken = (userId: unknown) =>
    userId != null && String(userId) !== "";
  const isMine = (userId: unknown) =>
    Boolean(myUserId) && isTaken(userId) && String(userId) === String(myUserId);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchTodolists(text);
  };

  return (
    <CollapsibleScreen
      variant="stack"
      header={
        <ScreenHeader title="Arbetsordrar" onBack={() => router.back()} />
      }
      scrollProps={{
        contentContainerStyle: {
          paddingHorizontal: 20,
          paddingTop: 8,
        },
      }}
    >
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Sök arbetsordrar…"
      />
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: "Jakarta",
          fontSize: 14,
          lineHeight: 21,
          marginTop: 10,
          marginBottom: 18,
        }}
      >
        Tilldela tillgängliga checklistor till dig själv.
      </Text>
      {loading ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 60,
          }}
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : (
        <>
            {todolists.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 60,
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 999,
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                  }}
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={22}
                    color={colors.textSubtle}
                  />
                </View>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: "Jakarta-Bold",
                    fontSize: 15,
                  }}
                >
                  Inga arbetsordrar
                </Text>
                <Text
                  style={{
                    color: colors.textSubtle,
                    fontFamily: "Jakarta",
                    fontSize: 13,
                    marginTop: 4,
                    textAlign: "center",
                    maxWidth: 260,
                  }}
                >
                  Det finns inga matchande arbetsordrar just nu.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {todolists.map((item) => {
                  const mine = isMine(item.user_id);
                  const takenByOther = isTaken(item.user_id) && !mine;
                  return (
                  <View
                    key={item.id}
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          backgroundColor: colors.brandGlow,
                          borderWidth: 1,
                          borderColor: colors.borderBrand,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name="clipboard"
                          size={18}
                          color={colors.brand}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: colors.text,
                            fontFamily: "Jakarta-Bold",
                            fontSize: 15,
                          }}
                          numberOfLines={1}
                        >
                          {item.name || "Namnlös arbetsorder"}
                        </Text>
                        <Text
                          style={{
                            color: colors.textSubtle,
                            fontFamily: "Jakarta",
                            fontSize: 12,
                            marginTop: 1,
                          }}
                          numberOfLines={1}
                        >
                          {item.belongs_to}
                        </Text>
                      </View>
                      {mine ? (
                        <Pill label="Din" variant="brand" />
                      ) : takenByOther ? (
                        <Pill label="Upptagen" variant="outline" />
                      ) : (
                        <Pill label="Ledig" variant="outline" />
                      )}
                    </View>

                    {item.description ? (
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontFamily: "Jakarta",
                          fontSize: 13,
                          lineHeight: 20,
                          marginTop: 10,
                        }}
                      >
                        {item.description}
                      </Text>
                    ) : null}

                    <TouchableOpacity
                      activeOpacity={0.85}
                      disabled={takenByOther}
                      onPress={() =>
                        mine
                          ? unassignTodoList(item.id)
                          : assignTodoList(item.id)
                      }
                      style={{
                        marginTop: 14,
                        paddingVertical: 12,
                        borderRadius: 999,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 6,
                        backgroundColor: takenByOther
                          ? colors.surfaceMuted
                          : mine
                            ? colors.surfaceMuted
                            : colors.brand,
                        opacity: takenByOther ? 0.6 : 1,
                        borderWidth: mine ? 1 : 0,
                        borderColor: colors.border,
                      }}
                    >
                      <Ionicons
                        name={
                          takenByOther
                            ? "lock-closed-outline"
                            : mine
                              ? "remove-circle-outline"
                              : "add-circle-outline"
                        }
                        size={16}
                        color={
                          takenByOther || mine
                            ? colors.textSubtle
                            : colors.brandOnBrand
                        }
                      />
                      <Text
                        style={{
                          color:
                            takenByOther || mine
                              ? colors.textSubtle
                              : colors.brandOnBrand,
                          fontFamily: "Jakarta-Bold",
                          fontSize: 13,
                        }}
                      >
                        {takenByOther
                          ? "Upptagen"
                          : mine
                            ? "Ta bort tilldelning"
                            : "Tilldela mig"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  );
                })}
              </View>
            )}
        </>
      )}
    </CollapsibleScreen>
  );
};

export default BrowseWorkOrders;
