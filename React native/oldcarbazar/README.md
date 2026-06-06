# Old Car Bazar — React Native App

Mobile app for **Old Car Bazar**, built with **Expo SDK 56** + **expo-router**.  
Uses the **same Django API** as the Next.js website.

## Folder location

```
old car bazar/
└── React native/
    └── oldcarbazar/   ← this app
```

## Quick start

### 1. Install (already done if scaffolded)

```bash
cd "React native/oldcarbazar"
npm install
```

### 2. Run on your phone (Expo Go)

```bash
npm start
```

- Install **Expo Go** from Play Store / App Store
- Scan the QR code shown in the terminal
- App loads live listings from production API

### 3. Run on Android emulator

```bash
npm run android
```

## API configuration

Default (works on real phone without local backend):

```
EXPO_PUBLIC_API_URL=https://old-car-bazar-api.onrender.com/api/v1
```

Edit `.env` for local Django:

| Device | API URL |
|--------|---------|
| Android emulator | `http://10.0.2.2:8000/api/v1` |
| Physical phone (same Wi-Fi) | `http://YOUR_PC_IP:8000/api/v1` |
| Production | `https://old-car-bazar-api.onrender.com/api/v1` |

After changing `.env`, restart Expo: `npm start`

## What's built (Phase 1)

- Home screen — browse used cars from backend
- Car detail — photos, specs, price, seller info
- Call seller + WhatsApp buttons
- Pull-to-refresh
- Featured / Boosted badges
- Old Car Bazar branding (#f75d34 orange)

## Next phases

| Phase | Features |
|-------|----------|
| 2 | Login / Register (JWT auth) |
| 3 | Search & filters (brand, city, budget) |
| 4 | Sell car (photo upload) |
| 5 | My Listings + Boost + Pro subscription |
| 6 | Play Store / App Store build (EAS) |

## Build for stores (later)

```bash
npx eas-cli login
npx eas build --platform android
npx eas build --platform ios
```

Requires [Expo EAS](https://expo.dev/eas) account (~$25 Play Store one-time, $99/yr Apple).

## Tech stack

- Expo SDK 56
- React Native 0.85
- expo-router (file-based routing)
- TypeScript
- Same `api.ts` patterns as Next.js website
