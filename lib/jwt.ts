export type JwtPayload = {
  exp?: number;
  sub?: string;
  oid?: string;
  tid?: string;
  iss?: string;
  aud?: string | string[];
  name?: string;
  email?: string;
  preferred_username?: string;
  [key: string]: unknown;
};

export function parseJwtPayload(token: string): JwtPayload | null {
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

export function azureAdIdFromPayload(payload: JwtPayload): string | null {
  const id = payload.oid || payload.sub;
  return typeof id === "string" && id.length > 0 ? id : null;
}

/** Treat tokens as expired this many seconds before `exp`. */
export const EXPIRY_SKEW_SECONDS = 60;

export function isTokenExpired(
  token: string,
  nowSeconds: number = Math.floor(Date.now() / 1000)
): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    // Opaque / non-JWT tokens: can't judge locally; rely on API 401 handling.
    return false;
  }
  return payload.exp <= nowSeconds + EXPIRY_SKEW_SECONDS;
}
