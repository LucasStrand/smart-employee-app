import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const ACCESS_TOKEN_KEY = "access_token";
const LOCAL_USER_ID_KEY = "local_user_id";

/** Treat tokens as expired this many seconds before `exp`. */
const EXPIRY_SKEW_SECONDS = 60;

let handlingUnauthorized = false;

export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor(message = "Session expired") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export const getAccessToken = () => AsyncStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string) =>
  AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);

export const clearSession = async () => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, LOCAL_USER_ID_KEY]);
};

function parseJwtPayload(token: string): { exp?: number } | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    // Opaque / non-JWT tokens: can't judge locally; rely on API 401 handling.
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + EXPIRY_SKEW_SECONDS;
}

/** Returns a non-expired access token, or null after ending a stale session. */
export async function getValidAccessToken(): Promise<string | null> {
  const token = await getAccessToken();
  if (!token) return null;

  if (isTokenExpired(token)) {
    await handleUnauthorized();
    return null;
  }

  return token;
}

/** Clear stored session and send the user back to sign-in (deduped). */
export async function handleUnauthorized(): Promise<void> {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  try {
    await clearSession();
    try {
      router.replace("/(auth)/welcome");
    } catch {
      // Navigator may not be mounted yet (e.g. splash). Auth gates still redirect.
    }
  } finally {
    // Allow a later session to trigger this again after remount/sign-in.
    setTimeout(() => {
      handlingUnauthorized = false;
    }, 1500);
  }
}
