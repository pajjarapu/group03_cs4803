# group03_cs4803

A pantry-first cooking app for CS 4803 — sign up, see what you can cook with what's
already in your pantry, cook it, log it, and watch your streak grow.

Built with Expo (React Native), TypeScript, and Expo Router. The MVP implements the
flow from the clickable HTML prototype (`Cooking App MVP Prototype.html`):

| Prototype screen | In the app |
| --- | --- |
| 01 Welcome & Sign Up | `src/app/index.tsx` |
| 02 Set Preferences | `src/app/onboarding.tsx` |
| 03 Home Dashboard | `src/app/(tabs)/(home)/home.tsx` |
| 04 Quick Pantry | `src/app/(tabs)/pantry.tsx` |
| 05 Cook Now | `src/app/(tabs)/(home)/cook-now.tsx` |
| 06 Recipe Detail | `src/app/recipe/[id].tsx` |
| 07 Log Meal (bottom sheet) | `src/components/log-meal-sheet.tsx` |
| 08 Achievement Unlocked | `src/components/achievement-modal.tsx` |
| 09 Progress | `src/app/(tabs)/progress.tsx` |
| — Settings tab | `src/app/(tabs)/settings.tsx` |

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

| Command                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `npm start`             | Start the Expo dev server                          |
| `npm run ios`           | Start the dev server and open the iOS Simulator    |
| `npm run android`       | Start the dev server and open the Android Emulator |
| `npm run web`           | Start the dev server and open the web build        |
| `npm run lint`          | Lint with ESLint (`expo lint`)                     |
| `npm run typecheck`     | Type-check with `tsc --noEmit`                     |
| `npm run reset-project` | Move the starter app to `app-example/` and start clean |

## What works

- **Account & onboarding** — email/password validation with an inline error state,
  multi-select dietary needs and goals, skill and time segmented controls.
- **Pantry** — live search over an ingredient catalog with a multi-select "bulk add"
  dropdown, All / Running low / category filters, Have ⇄ Running low toggles, and
  remove with an Undo toast.
- **Home** — streak card with the last seven days, "last cooked" line, recipe
  recommendations that react to filters, and dismiss-with-Undo for the feed.
- **Cook Now** — pantry-only matches grouped against "almost there" recipes, with
  sorting by time, tools, or rating.
- **Recipe detail** — cookware, pantry match count, missing/running-low ingredients,
  expandable ingredients + method, and a sticky "Mark Cooked" action.
- **Log Meal** — pantry deduction per ingredient (Used up / Low / Have), star rating,
  optional photo from the library, then the achievement celebration on a 7-day streak.
- **Progress** — streak hero, meals/recipes/rating stats, achievement tiles with locked
  progress, and recent cooks.
- **Light & dark themes**, custom Geist typography, toast + confetti animations.

## Project structure

```
src/
  app/                 Expo Router routes
    index.tsx          Welcome / sign up
    onboarding.tsx     Preferences
    (tabs)/
      (home)/          Home dashboard + Cook Now stack
      pantry.tsx
      progress.tsx
      settings.tsx
    recipe/[id].tsx    Recipe detail
  components/          Design system + app-specific UI
  data/                Ingredient catalog and recipes
  lib/                 Pantry matching, date helpers
  store/               In-memory app state (React context)
  theme/               Colors, type, spacing tokens
  types.ts             Shared types
```

## Data & state

The app runs on seeded demo data (24 pantry items, 6 recipes, a 6-day streak, two
recent cooks). State lives in `src/store/app-store.tsx` and resets when the app
reloads — there is no backend or persistence yet, so a fresh launch always starts
from the prototype's numbers. "Reset demo data" in Settings restores them.

Ingredient matching is name/id based: a recipe ingredient is *missing* when it has no
pantry entry, and *running low* when the pantry entry is marked low. Running-low items
still count as available. Oil, salt and pepper are always assumed on hand.

## Adding features

- Use `npx expo install <package>` instead of `npm install` so versions match the Expo SDK.
- `ios/` and `android/` are not committed; they are generated from `app.json`.
- A library with native code needs a development build (`npx expo run:ios|android`, or
  `eas build --profile development`) because Expo Go only bundles its own modules.
- See `AGENTS.md` for conventions aimed at AI coding agents.
