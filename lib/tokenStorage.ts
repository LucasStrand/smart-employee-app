import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "access_token";
const ID_TOKEN_KEY = "id_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const LOCAL_USER_ID_KEY = "local_user_id";

/** iOS SecureStore value limit; Graph JWTs can exceed this. */
const SECURE_STORE_MAX_BYTES = 2048;

let secureStoreAvailable: boolean | null = null;

async function canUseSecureStore(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  if (secureStoreAvailable !== null) return secureStoreAvailable;
  try {
    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }
  return secureStoreAvailable;
}

async function setItem(key: string, value: string): Promise<void> {
  const useSecure =
    (await canUseSecureStore()) &&
    value.length <= SECURE_STORE_MAX_BYTES;

  if (useSecure) {
    try {
      await SecureStore.setItemAsync(key, value);
      await AsyncStorage.removeItem(key);
      return;
    } catch {
      // Fall through to AsyncStorage (size / availability).
    }
  }

  await AsyncStorage.setItem(key, value);
  if (await canUseSecureStore()) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  }
}

async function getItem(key: string): Promise<string | null> {
  if (await canUseSecureStore()) {
    try {
      const secure = await SecureStore.getItemAsync(key);
      if (secure) return secure;
    } catch {
      // ignore
    }
  }
  return AsyncStorage.getItem(key);
}

async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
  if (await canUseSecureStore()) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  }
}

export const getStoredAccessToken = () => getItem(ACCESS_TOKEN_KEY);
export const getStoredIdToken = () => getItem(ID_TOKEN_KEY);
export const getStoredRefreshToken = () => getItem(REFRESH_TOKEN_KEY);
export const getStoredLocalUserId = () => getItem(LOCAL_USER_ID_KEY);

export const setStoredAccessToken = (token: string) =>
  setItem(ACCESS_TOKEN_KEY, token);
export const setStoredIdToken = (token: string) => setItem(ID_TOKEN_KEY, token);
export const setStoredRefreshToken = (token: string) =>
  setItem(REFRESH_TOKEN_KEY, token);
export const setStoredLocalUserId = (id: string) =>
  setItem(LOCAL_USER_ID_KEY, id);

export async function clearStoredSession(): Promise<void> {
  await Promise.all([
    removeItem(ACCESS_TOKEN_KEY),
    removeItem(ID_TOKEN_KEY),
    removeItem(REFRESH_TOKEN_KEY),
    removeItem(LOCAL_USER_ID_KEY),
  ]);
}
