// lib/apiConfig.ts
import { getValidAccessToken, getValidIdToken } from "./auth";
import { getNeonApiBaseUrl } from "./apiBaseUrl";

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
    baseURL: getNeonApiBaseUrl(),
    getToken: async () => getValidIdToken(),
  },
  [ApiType.NEXT]: {
    baseURL: process.env.EXPO_PUBLIC_NEXT_API_URL ?? "",
    getToken: async () => process.env.EXPO_PUBLIC_NEXT_TOKEN ?? "",
  },
  [ApiType.GRAPH]: {
    baseURL: process.env.EXPO_PUBLIC_GRAPH_API ?? "",
    getToken: async () => getValidAccessToken(),
  },
};
