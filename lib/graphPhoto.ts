import { getValidAccessToken, refreshAccessToken } from "./auth";

function graphBase(): string {
  return (
    process.env.EXPO_PUBLIC_GRAPH_API ?? "https://graph.microsoft.com/v1.0"
  ).replace(/\/$/, "");
}

async function blobToDataUri(blob: Blob): Promise<string | null> {
  if (typeof FileReader !== "undefined") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(typeof reader.result === "string" ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  }

  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const mime = blob.type || "image/jpeg";
  return `data:${mime};base64,${btoa(binary)}`;
}

async function downloadPhoto(token: string): Promise<Response> {
  return fetch(`${graphBase()}/me/photo/$value`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Microsoft Graph profile photo as a data URI, or null if none. */
export async function fetchGraphPhoto(): Promise<string | null> {
  let token = await getValidAccessToken();
  if (!token) return null;

  let response = await downloadPhoto(token);
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return null;
    token = refreshed;
    response = await downloadPhoto(token);
  }

  if (response.status === 404 || !response.ok) return null;

  try {
    const blob = await response.blob();
    return await blobToDataUri(blob);
  } catch {
    return null;
  }
}
