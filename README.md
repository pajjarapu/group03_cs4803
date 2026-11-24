# group03_cs4803

Sprint tracking app for CS 4803 — built with Expo (React Native), TypeScript, and Expo Router.

## Requirements

- Node.js 20+ (developed on Node 24)
- npm
- [Expo Go](https://expo.dev/go) on a physical device, or an iOS Simulator / Android Emulator

## Getting started

```bash
npm install
npm start          # start the dev server, then scan the QR code with Expo Go
```

Run on a specific platform:

```bash
npm run ios        # iOS Simulator (requires Xcode)
npm run android    # Android Emulator (requires Android Studio)
npm run web        # browser
```

## Scripts

| Command                  | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `npm start`              | Start the Expo dev server                          |
| `npm run ios`            | Start the dev server and open the iOS Simulator    |
| `npm run android`        | Start the dev server and open the Android Emulator |
| `npm run web`            | Start the dev server and open the web build        |
| `npm run lint`           | Lint with ESLint (`expo lint`)                     |
| `npm run typecheck`      | Type-check with `tsc --noEmit`                     |
| `npm run reset-project`  | Move the starter app to `app-example/` and start clean |

## Project structure

```
src/
  app/              Expo Router routes (file-based navigation)
    _layout.tsx     Root layout / navigator
    index.tsx       Home screen
    explore.tsx     Explore screen
  components/       Reusable UI components
  constants/        Theme tokens (colors, spacing, max width)
  hooks/            Shared hooks (color scheme, theme)
assets/             Icons, splash screen, and other static assets
app.json            Expo app config (name, slug, icons, plugins)
```

Adding a screen means adding a file under `src/app/`. Non-route code stays outside that folder.

## Conventions

- Use `npx expo install <package>` instead of `npm install` so package versions match the Expo SDK.
- `ios/` and `android/` are not committed; they are generated from `app.json` when needed.
- If a new library ships native code, it won't work in Expo Go — create a development build with
  `npx expo run:ios` / `npx expo run:android`, or `eas build --profile development`.
- See `AGENTS.md` for notes aimed at AI coding agents working in this repo.
