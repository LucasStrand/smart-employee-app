// src/api/fetchAPI.ts
import { API_CONFIG, ApiType } from "./apiConfig";
import { handleUnauthorized, UnauthorizedError } from "./auth";

export async function fetchAPI(
  endpointOrUrl: string,
  options: RequestInit = {},
  apiType: ApiType = ApiType.NEON // default to NEON
): Promise<any> {
  // Get config for the chosen API
  const { baseURL, getToken } = API_CONFIG[apiType];

  // Determine if the endpoint is fully qualified or relative
  const finalURL = endpointOrUrl.startsWith("http")
    ? endpointOrUrl
    : `${baseURL}${endpointOrUrl}`;

  // Retrieve the token (if this API uses one)
  let token = null;
  if (getToken) {
    token = await getToken();
  }

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  // If we have a token, attach it
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(finalURL, {
      ...options,
      headers,
    });

    if (response.status === 401 && token) {
      await handleUnauthorized();
      throw new UnauthorizedError();
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (!(error instanceof UnauthorizedError)) {
      console.error("Fetch error:", error);
    }
    throw error;
  }
}
