# Production Readiness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Get both the Next.js website and the React Native app production-ready for launch.

**Architecture:** The website (Next.js 16, Prisma/SQLite, Nodemailer) serves as both the public site and the API backend. The Expo app connects to the website's `/api/*` routes. Both share the same service catalog and booking flow. The plan is ordered by blast radius: foundation first, then security, then polish.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Prisma, Nodemailer, Expo SDK 54, expo-router, Zustand, react-native-reanimated

---

## Phase 1: Website Foundation

### Task 1: Add favicon and OG image

The root layout references `/og-image.jpg` but it doesn't exist. No `favicon.ico` either.

**Files:**
- Create: `fonsi-website/public/favicon.ico`
- Create: `fonsi-website/public/og-image.jpg`
- Verify: `fonsi-website/src/app/layout.tsx` (metadata.openGraph.images)

**Step 1:** Generate a favicon from the existing logo SVG. Use the dark logo as source.

```bash
# Option A: Use an online converter (manual step)
# Option B: If ImageMagick is installed:
convert fonsi-website/public/images/fonsi-logo-dark.svg -resize 32x32 fonsi-website/public/favicon.ico
```

If tooling isn't available, create a simple `favicon.ico` placeholder and note it for manual replacement with the real branded icon.

**Step 2:** Create an OG image (1200x630). This is a manual design step — for now, verify the metadata path is correct and create a placeholder or use one of the existing gallery images scaled appropriately.

**Step 3:** Verify `layout.tsx` metadata references the correct paths:
- `openGraph.images[0].url` should be `/og-image.jpg`
- Verify `icons` metadata includes favicon

**Step 4:** Commit

```bash
git add fonsi-website/public/favicon.ico fonsi-website/public/og-image.jpg
git commit -m "feat(website): add favicon and OG image placeholders"
```

---

### Task 2: Configure production environment variables

The `.env` has dev-only values. Email SMTP is completely missing.

**Files:**
- Modify: `fonsi-website/.env`
- Verify: `fonsi-website/.env.example`

**Step 1:** Update `.env` with all required variables (values will be production secrets — use placeholders that are clearly marked):

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="CHANGE_ME_GENERATE_WITH_openssl_rand_base64_32"
NEXTAUTH_URL="http://localhost:3000"

# Email (configure for Gmail App Password or other SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM="noreply@fonsibycristal.com"
```

**Step 2:** Verify `.env.example` matches and documents all variables.

**Step 3:** Commit (only `.env.example`, never `.env`)

```bash
git add fonsi-website/.env.example
git commit -m "docs(website): update .env.example with all required variables"
```

---

### Task 3: Initialize and seed the database

The `dev.db` may be empty. Ensure migrations and seed data work.

**Files:**
- Verify: `fonsi-website/prisma/schema.prisma`
- Verify: `fonsi-website/seed.ts`
- Generated: `fonsi-website/prisma/dev.db`

**Step 1:** Run Prisma push and seed:

```bash
cd fonsi-website
npx prisma db push
npx prisma db seed
```

**Step 2:** Verify seed worked:

```bash
npx prisma studio
# Or query via API: curl http://localhost:3000/api/services
```

Expected: 25 services returned (18 Hair, 3 Bridal, 3 Makeup, 1 Waxing), business hours for all 7 days.

**Step 3:** Commit only if schema changed. The `dev.db` is in `.gitignore`.

---

### Task 4: Add rate limiting to booking API

The POST `/api/appointments` endpoint has no rate limiting — vulnerable to spam.

**Files:**
- Create: `fonsi-website/src/lib/rate-limit.ts`
- Modify: `fonsi-website/src/app/api/appointments/route.ts`

**Step 1:** Create a simple in-memory rate limiter:

```typescript
// src/lib/rate-limit.ts
const rateMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
```

**Step 2:** Apply to the POST handler in `appointments/route.ts`:

```typescript
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'
  if (!rateLimit(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  // ... existing logic
}
```

**Step 3:** Run dev server, test with rapid requests, verify 429 after limit.

**Step 4:** Commit

```bash
git add fonsi-website/src/lib/rate-limit.ts fonsi-website/src/app/api/appointments/route.ts
git commit -m "feat(website): add rate limiting to appointments API"
```

---

### Task 5: Add React error boundary

No error boundary exists. Unhandled render errors crash the page.

**Files:**
- Create: `fonsi-website/src/components/ErrorBoundary.tsx`
- Modify: `fonsi-website/src/app/layout.tsx`

**Step 1:** Create the error boundary:

```tsx
'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-serif mb-4">Something went wrong</h2>
            <button onClick={() => this.setState({ hasError: false })}
              className="underline">Try again</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
```

**Step 2:** Wrap the layout children in `layout.tsx`.

**Step 3:** Commit

---

## Phase 2: App Foundation

### Task 6: Create `app.config.ts` for environment variables

The app has no environment configuration. API URL is hardcoded as a fallback to a non-existent domain.

**Files:**
- Create: `fonsi-app/app.config.ts`
- Modify: `fonsi-app/src/api/client.ts` (update BASE_URL)
- Delete or keep: `fonsi-app/app.json` (replaced by app.config.ts)

**Step 1:** Convert `app.json` to `app.config.ts`:

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Fonsi by Cristal',
  slug: 'fonsi-by-cristal',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'fonsi',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0a0a0a',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.fonsi.cristal',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0a0a0a',
    },
    package: 'com.fonsi.cristal',
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    'expo-router',
    ['expo-splash-screen', { backgroundColor: '#0a0a0a', image: './assets/splash.png', imageWidth: 200 }],
    ['expo-notifications', { icon: './assets/icon.png', color: '#ffffff' }],
  ],
  experiments: { typedRoutes: true },
  extra: {
    router: { origin: false },
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    eas: { projectId: process.env.EAS_PROJECT_ID || '' },
  },
})
```

**Step 2:** Create `.env` for the app:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**Step 3:** Update `src/api/client.ts` BASE_URL:

```typescript
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
```

This points the app at the Next.js website's API during development.

**Step 4:** Delete `app.json` (now replaced by `app.config.ts`).

**Step 5:** Commit

```bash
git add fonsi-app/app.config.ts fonsi-app/.env fonsi-app/src/api/client.ts
git rm fonsi-app/app.json
git commit -m "feat(app): add app.config.ts with environment variables, wire API to website"
```

---

### Task 7: Create EAS Build configuration

Cannot build for App Store / Play Store without EAS config.

**Files:**
- Create: `fonsi-app/eas.json`

**Step 1:** Create `eas.json`:

```json
{
  "cli": { "version": ">= 15.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": true }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": { "appleId": "", "ascAppId": "", "appleTeamId": "" },
      "android": { "serviceAccountKeyPath": "" }
    }
  }
}
```

**Step 2:** Note for user: Run `eas build:configure` after setting up an Expo account and replacing `YOUR_EAS_PROJECT_ID` in `app.config.ts`.

**Step 3:** Commit

```bash
git add fonsi-app/eas.json
git commit -m "feat(app): add EAS Build configuration"
```

---

### Task 8: Add error boundary to app

No error boundary exists in the React Native app.

**Files:**
- Create: `fonsi-app/src/components/ErrorBoundary.tsx`
- Modify: `fonsi-app/app/_layout.tsx`

**Step 1:** Create error boundary component:

```tsx
import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '@constants/theme';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('App ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.link}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgPrimary },
  title: { fontSize: FONTS['2xl'], fontFamily: FONTS.serifBold, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  link: { fontSize: FONTS.base, color: COLORS.primary, textDecorationLine: 'underline' },
});
```

**Step 2:** Wrap the root layout's `<Stack>` in `<ErrorBoundary>`.

**Step 3:** Commit

---

## Phase 3: Security & Reliability

### Task 9: Fix API URL typo and add CORS

The app's fallback URL has a typo: `fonsibycrystal.com` (should be `fonsibycristal.com`). Also, the website API needs to accept requests from the mobile app origin.

**Files:**
- Verify: `fonsi-app/src/api/client.ts` (already fixed in Task 6)
- Modify: `fonsi-website/next.config.ts` (add CORS headers if needed)

**Step 1:** Verify the app's `client.ts` no longer has the typo (fixed in Task 6).

**Step 2:** If the website will be deployed to a different domain than the app connects to, add CORS headers to the API routes. For Vercel, add to `next.config.ts`:

```typescript
async headers() {
  return [{
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
      { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
    ],
  }]
}
```

**Step 3:** Commit

---

### Task 10: Add duplicate booking prevention

Users can book the same time slot multiple times. The availability API checks existing bookings, but there's no unique constraint.

**Files:**
- Modify: `fonsi-website/src/app/api/appointments/route.ts`

**Step 1:** Add a duplicate check in the POST handler before creating the appointment:

```typescript
// Check for existing appointment at same date+time
const existing = await prisma.appointment.findFirst({
  where: {
    date: new Date(`${date}T${time}:00`),
    status: { in: ['pending', 'confirmed'] },
  },
})
if (existing) {
  return Response.json({ error: 'This time slot is already booked' }, { status: 409 })
}
```

**Step 2:** Test by trying to book the same slot twice.

**Step 3:** Commit

---

## Phase 4: Deployment Configuration

### Task 11: Website deployment prep (Vercel)

**Files:**
- Modify: `fonsi-website/next.config.ts`
- Verify: `fonsi-website/package.json` scripts

**Step 1:** Enable image optimization (remove `unoptimized: true`):

```typescript
// next.config.ts
images: {
  // Remove unoptimized: true
  remotePatterns: [],
}
```

**Step 2:** Add `postinstall` script for Prisma generation:

```json
"postinstall": "prisma generate"
```

**Step 3:** Verify build works:

```bash
cd fonsi-website && npm run build
```

**Step 4:** Commit

---

### Task 12: Create production deployment checklist

**Files:**
- Create: `docs/DEPLOY.md`

**Step 1:** Write deployment checklist:

```markdown
# Deployment Checklist

## Website (Vercel)
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard:
   - DATABASE_URL (use Vercel Postgres or PlanetScale)
   - NEXTAUTH_SECRET (generate: `openssl rand -base64 32`)
   - NEXTAUTH_URL (production URL)
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
4. Deploy
5. Run `npx prisma db push` against production DB
6. Run `npx prisma db seed` to populate services
7. Test booking flow end-to-end
8. Verify email confirmation arrives

## App (EAS)
1. Run `eas login`
2. Run `eas build:configure` (sets projectId)
3. Update `EXPO_PUBLIC_API_URL` to production website URL
4. Run `eas build --platform ios --profile production`
5. Run `eas build --platform android --profile production`
6. Submit to TestFlight / Play Store internal testing
7. Test on real devices
```

**Step 2:** Commit

---

## Phase 5: Polish (Lower Priority)

### Task 13: Add basic analytics to website

**Files:**
- Modify: `fonsi-website/src/app/layout.tsx`

Add Google Analytics 4 or Vercel Analytics. For Vercel Analytics:

```bash
cd fonsi-website && npm install @vercel/analytics
```

Then add `<Analytics />` component to the root layout.

---

### Task 14: Persist app booking state

Zustand stores lose all state on app restart. Persist the appointment store.

**Files:**
- Modify: `fonsi-app/src/store/appointmentStore.ts`

```bash
cd fonsi-app && npx expo install @react-native-async-storage/async-storage
```

Add Zustand persist middleware to `appointmentStore`:

```typescript
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAppointmentStore = create(
  persist<AppointmentStoreState>(
    (set, get) => ({ /* existing store */ }),
    { name: 'appointments', storage: createJSONStorage(() => AsyncStorage) }
  )
)
```

---

### Task 15: Strengthen phone validation

Both website and app accept any 10+ char string as a phone number.

**Files:**
- Modify: `fonsi-website/src/lib/validation.ts`
- Modify: `fonsi-app/app/(tabs)/book.tsx`

Update Zod schema:
```typescript
phone: z.string().regex(/^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, 'Enter a valid US phone number'),
```

---

## Summary

| Phase | Tasks | Priority |
|-------|-------|----------|
| **1. Website Foundation** | Tasks 1-5 | CRITICAL |
| **2. App Foundation** | Tasks 6-8 | CRITICAL |
| **3. Security** | Tasks 9-10 | HIGH |
| **4. Deployment** | Tasks 11-12 | HIGH |
| **5. Polish** | Tasks 13-15 | MEDIUM |

**Estimated scope:** 15 tasks across 5 phases. Phases 1-4 are required for production. Phase 5 is recommended but not blocking.
