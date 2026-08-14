import { API_CONFIG, ApiType } from "./apiConfig";
import {
  handleUnauthorized,
  refreshAccessToken,
  UnauthorizedError,
} from "./auth";

export type FetchAPIFlags = {
  /** When false, 401 throws without clearing the session. Default true. */
  resetOnUnauthorized?: boolean;
};

export async function fetchAPI(
  endpointOrUrl: string,
  options: RequestInit = {},
  apiType: ApiType = ApiType.NEON,
  flags: FetchAPIFlags = {}
): Promise<any> {
  const resetOnUnauthorized = flags.resetOnUnauthorized !== false;
  const { baseURL, getToken } = API_CONFIG[apiType];

  const finalURL = endpointOrUrl.startsWith("http")
    ? endpointOrUrl
    : `${baseURL}${endpointOrUrl}`;

  const token = getToken ? await getToken() : null;
  const response = await send(finalURL, options, token);

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retriedToken = getToken ? await getToken() : refreshed;
      if (retriedToken && retriedToken !== token) {
        const retried = await send(finalURL, options, retriedToken);
        if (retried.ok) {
          return retried.json();
        }
        if (retried.status !== 401) {
          throw await httpError(retried);
        }
      }
    }

    if (resetOnUnauthorized) {
      await handleUnauthorized();
    }
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const error = await httpError(response);
    console.error("Fetch error:", error);
    throw error;
  }

  return response.json();
}

async function httpError(response: Response): Promise<Error> {
  let detail = "";
  try {
    const body = await response.clone().json();
    if (body?.error) detail = `: ${body.error}`;
  } catch {
    // ignore
  }
  return new Error(`HTTP error! Status: ${response.status}${detail}`);
}

function send(
  url: string,
  options: RequestInit,
  token: string | null
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}
