import Constants from "expo-constants";
import { Platform } from "react-native";

function metroHost(): string | null {
  const raw =
    Constants.expoGoConfig?.debuggerHost ||
    Constants.expoConfig?.hostUri ||
    (
      Constants as {
        manifest?: { debuggerHost?: string };
      }
    ).manifest?.debuggerHost;

  if (!raw) return null;
  return String(raw).split("/")[0].replace(/\/$/, "");
}

/** Base URL for Expo Router API routes (`app/(api)/*+api.ts`). */
export function getNeonApiBaseUrl(): string {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  if (Platform.OS === "web") return "";

  // Expo Go / dev client: hit this machine's Metro server, not production origin.
  if (typeof __DEV__ === "undefined" || __DEV__) {
    const host = metroHost();
    if (host) return `http://${host}`;
  }

  return (process.env.EXPO_PUBLIC_SERVER_URL ?? "").replace(/\/$/, "");
}
