import { createRemoteJWKSet, jwtVerify } from "jose";
import { neon } from "@neondatabase/serverless";

import { AZURE_CLIENT_ID, AZURE_TENANT_ID } from "@/lib/authConfig";
import { azureAdIdFromPayload, type JwtPayload } from "@/lib/jwt";

const JWKS = AZURE_TENANT_ID
  ? createRemoteJWKSet(
      new URL(
        `https://login.microsoftonline.com/${AZURE_TENANT_ID}/discovery/v2.0/keys`
      )
    )
  : null;

const ISSUER = AZURE_TENANT_ID
  ? `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0`
  : "";

function unauthorized(message = "Unauthorized") {
  return Response.json({ error: message }, { status: 401 });
}

export async function requireAuth(
  request: Request
): Promise<
  | {
      ok: true;
      azureAdId: string;
      oid?: string;
      sub?: string;
      payload: JwtPayload;
    }
  | { ok: false; response: Response }
> {
  if (!JWKS || !AZURE_TENANT_ID || !AZURE_CLIENT_ID) {
    return {
      ok: false,
      response: Response.json(
        { error: "Auth is not configured" },
        { status: 500 }
      ),
    };
  }

  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  const token = match?.[1]?.trim();
  if (!token) {
    return { ok: false, response: unauthorized() };
  }

  try {
    // Validate the ID token (aud = this app). Graph access tokens are not
    // verifiable here — Microsoft signs them with a nonce for Graph only.
    const { payload } = await jwtVerify(token, JWKS, {
      clockTolerance: 60,
      audience: AZURE_CLIENT_ID,
      issuer: ISSUER,
    });

    if (
      String(payload.tid ?? "").toLowerCase() !== AZURE_TENANT_ID.toLowerCase()
    ) {
      return { ok: false, response: unauthorized("Wrong tenant") };
    }

    const azureAdId = azureAdIdFromPayload(payload as JwtPayload);
    if (!azureAdId) {
      return { ok: false, response: unauthorized() };
    }

    return {
      ok: true,
      azureAdId,
      oid: typeof payload.oid === "string" ? payload.oid : undefined,
      sub: typeof payload.sub === "string" ? payload.sub : undefined,
      payload: payload as JwtPayload,
    };
  } catch (error) {
    console.error("requireAuth: token verification failed", error);
    return { ok: false, response: unauthorized() };
  }
}

export async function requireLocalUser(
  request: Request
): Promise<
  | { ok: true; userId: number; azureAdId: string }
  | { ok: false; response: Response }
> {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth;

  const sql = neon(process.env.DATABASE_URL || "");
  const oid = auth.oid ?? auth.azureAdId;
  const sub = auth.sub ?? auth.azureAdId;
  const [user] = await sql`
    SELECT id FROM users
    WHERE azure_ad_id = ${oid} OR azure_ad_id = ${sub}
    LIMIT 1
  `;

  if (!user?.id) {
    return {
      ok: false,
      response: Response.json(
        { error: "User is not provisioned" },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    userId: Number(user.id),
    azureAdId: auth.azureAdId,
  };
}
