// lib/apiConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export enum ApiType {
  NEON = "neon",
  NEXT = "next",
  GRAPH = "graph",
}

type ApiConfig = {
  baseURL: string;
  getToken?: () => Promise<string | null>;
};

export const API_CONFIG: Record<ApiType, ApiConfig> = {
  [ApiType.NEON]: {
    baseURL: "",
    getToken: async () => null,
  },
  [ApiType.NEXT]: {
    baseURL: process.env.EXPO_PUBLIC_NEXT_API_URL ?? "",
    getToken: async () => process.env.EXPO_PUBLIC_NEXT_TOKEN ?? "",
  },
  [ApiType.GRAPH]: {
    baseURL:
      process.env.EXPO_PUBLIC_GRAPH_API ?? "https://graph.microsoft.com/v1.0",
    getToken: async () => {
      return (await AsyncStorage.getItem("access_token")) || "";
    },
  },
};
