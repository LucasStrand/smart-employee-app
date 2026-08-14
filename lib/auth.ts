import { router } from "expo-router";

import {
  AUTH_SCOPE_STRING,
  AZURE_CLIENT_ID,
  AZURE_TOKEN_URL,
} from "./authConfig";
import { isTokenExpired } from "./jwt";
import {
  clearStoredSession,
  getStoredAccessToken,
  getStoredIdToken,
  getStoredLocalUserId,
  getStoredRefreshToken,
  setStoredAccessToken,
  setStoredIdToken,
  setStoredLocalUserId,
  setStoredRefreshToken,
} from "./tokenStorage";

export class UnauthorizedError extends Error {
  readonly status = 401;

  constructor(message = "Session expired") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

let handlingUnauthorized = false;
let inFlightRefresh: Promise<string | null> | null = null;

export const getAccessToken = () => getStoredAccessToken();
export const getLocalUserId = () => getStoredLocalUserId();

export const setAccessToken = (token: string) => setStoredAccessToken(token);

export const setLocalUserId = (id: string) => setStoredLocalUserId(id);

export async function setSessionTokens(params: {
  accessToken: string;
  idToken?: string | null;
  refreshToken?: string | null;
}): Promise<void> {
  await setStoredAccessToken(params.accessToken);
  if (params.idToken) {
    await setStoredIdToken(params.idToken);
  }
  if (params.refreshToken) {
    await setStoredRefreshToken(params.refreshToken);
  }
}

export const clearSession = () => clearStoredSession();

export async function refreshAccessToken(): Promise<string | null> {
  if (inFlightRefresh) return inFlightRefresh;

  inFlightRefresh = (async () => {
    const refreshToken = await getStoredRefreshToken();
    if (!refreshToken || !AZURE_CLIENT_ID) return null;

    try {
      const body = new URLSearchParams({
        client_id: AZURE_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        scope: AUTH_SCOPE_STRING,
      });

      const response = await fetch(AZURE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      const data = await response.json();
      if (!response.ok || data.error || !data.access_token) {
        return null;
      }

      await setSessionTokens({
        accessToken: data.access_token,
        idToken: data.id_token,
        refreshToken: data.refresh_token ?? refreshToken,
      });
      return data.access_token as string;
    } catch {
      return null;
    }
  })();

  try {
    return await inFlightRefresh;
  } finally {
    inFlightRefresh = null;
  }
}

/** Returns a non-expired access token, refreshing when possible. */
export async function getValidAccessToken(): Promise<string | null> {
  const token = await getStoredAccessToken();
  if (!token) return null;

  if (!isTokenExpired(token)) return token;

  const refreshed = await refreshAccessToken();
  if (refreshed) return refreshed;

  await handleUnauthorized();
  return null;
}

/**
 * ID token for our own API. Graph access tokens cannot be signature-checked
 * by third-party APIs (Microsoft puts a nonce in the header).
 */
export async function getValidIdToken(): Promise<string | null> {
  const token = await getStoredIdToken();
  if (token && !isTokenExpired(token)) return token;

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    if (token) await handleUnauthorized();
    return null;
  }

  const next = await getStoredIdToken();
  if (next && !isTokenExpired(next)) return next;

  await handleUnauthorized();
  return null;
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
    setTimeout(() => {
      handlingUnauthorized = false;
    }, 1500);
  }
}
