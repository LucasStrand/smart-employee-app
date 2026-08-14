export const AZURE_CLIENT_ID =
  process.env.EXPO_PUBLIC_AZURE_CLIENT_ID ?? "";
export const AZURE_TENANT_ID =
  process.env.EXPO_PUBLIC_AZURE_TENANT_ID ?? "";

export const AZURE_AUTHORITY = `https://login.microsoftonline.com/${AZURE_TENANT_ID}`;
export const AZURE_TOKEN_URL = `${AZURE_AUTHORITY}/oauth2/v2.0/token`;
export const AZURE_DISCOVERY_URL = `${AZURE_AUTHORITY}/v2.0`;

export const AUTH_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  "User.Read",
] as const;

export const AUTH_SCOPE_STRING = AUTH_SCOPES.join(" ");

export const GRAPH_AUDIENCES = [
  "https://graph.microsoft.com",
  "00000003-0000-0000-c000-000000000000",
];
