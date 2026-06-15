# Smart Teknik – Employee App

An [Expo](https://expo.dev) (React Native) app for Smart Teknik field staff. It combines the
company **manual / playbook** (categories → chapters, bookmarks, full-text search) with
**work orders and checklists** (todolists, self-checks), behind Microsoft Azure AD sign-in.

Runs on iOS, Android, and web via [Expo Router](https://docs.expo.dev/router/introduction)
file-based routing.

## Stack

- **Expo Router** — file-based routing (`app/`)
- **NativeWind / Tailwind** — styling, with a custom theme in `lib/theme.ts` + `lib/ThemeContext.tsx`
- **expo-auth-session** — Microsoft Azure AD (OAuth 2.0 + PKCE) sign-in
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

2. Create a `.env` file (values not committed):

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | Neon Postgres connection string (used by `app/(api)/` routes) |
   | `EXPO_PUBLIC_GRAPH_API` | Microsoft Graph base URL (for `/me`) |
   | `EXPO_PUBLIC_NEXT_API_URL` | Optional secondary API base URL |
   | `EXPO_PUBLIC_NEXT_TOKEN` | Token for the secondary API |
   | `EXPO_PUBLIC_SERVER_URL` | Server URL for relative API calls |

   Azure AD `CLIENT_ID` / `TENANT_ID` are currently set in `app/(auth)/sign-in.tsx`.

3. Start the app:

   ```bash
   npx expo start
   ```

   Then open in a development build, Android emulator, iOS simulator, or Expo Go.

## Scripts

- `npm start` / `npm run android` / `npm run ios` / `npm run web` — launch Expo
- `npm test` — Jest (watch mode)
- `npm run lint` — Expo lint
- `npx tsc --noEmit` — typecheck

## Auth flow

Unauthenticated users land on the `(auth)/welcome` onboarding pager, then sign in with their
Microsoft account in `(auth)/sign-in`. On success the access token is stored
(`AsyncStorage`), the user is upserted via `app/(api)/user`, and the app redirects to
`(root)/(tabs)/home`.
