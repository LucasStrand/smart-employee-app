# Smart Teknik – Employee App

An [Expo](https://expo.dev) (React Native) app for Smart Teknik field staff. It combines the
company **manual / playbook** (categories → chapters, bookmarks, full-text search) with
**work orders and checklists** (todolists, self-checks), behind Microsoft Azure AD sign-in.

Runs on iOS, Android, and web via [Expo Router](https://docs.expo.dev/router/introduction)
file-based routing.

## Stack

- **Expo Router** — file-based routing (`app/`)
- **NativeWind / Tailwind** — styling, with a custom theme in `lib/theme.ts` + `lib/ThemeContext.tsx`
- **expo-auth-session** — Microsoft Azure AD (OAuth 2.0 + PKCE) sign-in, with refresh tokens
- **Neon (Postgres)** — data, accessed through Expo Router API routes in `app/(api)/`
- **Microsoft Graph** — user profile (`/me`)

## Project layout

```
app/
  (auth)/        welcome onboarding pager + Microsoft sign-in
  (root)/(tabs)/ home, library, search, favorites, profile
  (root)/        category/[id], chapter/[id], browse-workorders
  (api)/         server routes: todolist, assigned-todolist, archive-todolist, user
components/      shared UI (playbook/, glass/, Todo/)
lib/             theme, auth, fetch, api config, manual content, hooks
```

## Get started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in values (`.env` is not committed).

3. Start the app:

   ```bash
   npx expo start
   ```

   Prefer a **physical device** or a **dev build** for Microsoft login. Android
   emulators often fail with `DNS_PROBE_FINISHED_BAD_CONFIG` on
   `login.microsoftonline.com` (emulator DNS, not Entra). Cold-boot the AVD,
   turn off VPN, or test on a phone.

## Microsoft Entra redirect URIs

The app uses scheme `smart-employee-app` and path `auth`.

In the Entra app registration add these as **Mobile and desktop applications**
redirect URIs (exact match), and enable **Allow public client flows**:

| Environment | Redirect URI |
| --- | --- |
| Dev / production build | `smart-employee-app://auth` |
| Expo Go (current SDK) | `expo://YOUR-LAN-IP:8081/--/auth` e.g. `expo://192.168.8.167:8081/--/auth` |
| Older Expo Go | `exp://YOUR-LAN-IP:8081/--/auth` |

The URI must match **character for character**, including `expo://` vs `exp://`.
LAN IPs change; add the new one if your Wi-Fi address changes, or use a
development build so only `smart-employee-app://auth` is needed.

The sign-in screen shows the live redirect URI in development mode.

Also add API permission `User.Read` (and `offline_access` via the OpenID scopes)
with admin consent if your tenant requires it.

## Scripts

- `npm start` / `npm run android` / `npm run ios` / `npm run web` — launch Expo
- `npm test` — Jest (watch mode)
- `npm test -- --watchAll=false` — single Jest run
- `npm run lint` — Expo lint
- `npx tsc --noEmit` — typecheck

## Auth flow

Unauthenticated users land on the `(auth)/welcome` onboarding pager, then sign in with their
Microsoft account in `(auth)/sign-in`. Tokens are stored in SecureStore when possible
(AsyncStorage fallback on web / oversized JWTs). Expired access tokens are refreshed
silently; if refresh fails the session is cleared and the user is sent back to welcome.
On success the user is upserted via `app/(api)/user`, and the app redirects to
`(root)/(tabs)/home`. API routes verify the Microsoft access token.
