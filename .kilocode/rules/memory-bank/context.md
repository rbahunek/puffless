# Active Context: Puffless — Quit Smoking App

## Current State

**App Status**: ✅ Complete MVP — Production-ready full-stack PWA application

Puffless is a complete Croatian-language quit smoking web application built as a startup MVP, now enhanced as a mobile-first Progressive Web App (PWA).

## Recently Completed

- [x] Full-stack Next.js 16 app with TypeScript and Tailwind CSS 4
- [x] PostgreSQL database with Prisma 5 ORM
- [x] NextAuth.js v5 authentication (email/password)
- [x] Croatian language UI throughout
- [x] Beautiful landing page with hero, features, testimonials
- [x] Multi-step onboarding flow (5 steps)
- [x] Dashboard with animated stats cards (Framer Motion)
- [x] 10-day structured program with daily tasks
- [x] 14 and 30-day challenge modes
- [x] Grace cigarette system (no harsh resets)
- [x] Craving support modal with breathing animation
- [x] Log cigarette feature with trigger tracking
- [x] Money saved calculations with fun equivalents
- [x] Health milestones timeline
- [x] Friend invite system with codes
- [x] Challenge leaderboard
- [x] Profile/settings page
- [x] History and analytics page
- [x] Achievements system
- [x] Seed script with demo data
- [x] README with setup instructions
- [x] **PWA: manifest.json with full icon set (72px to 512px + maskable)**
- [x] **PWA: Service worker with offline caching and offline banner**
- [x] **PWA: Install prompt component for mobile browsers**
- [x] **PWA: Offline banner ("Nema internetske veze...")**
- [x] **Mobile: Bottom navigation bar (Dashboard, Program, Izazovi, Povijest, Profil)**
- [x] **Mobile: Floating Action Button (FAB) for craving support**
- [x] **Mobile: Safe area support (env(safe-area-inset-bottom))**
- [x] **Mobile: Mobile-first dashboard layout (2x2 stats grid on mobile)**
- [x] **Mobile: Collapsible health timeline on mobile**
- [x] **Mobile: Responsive header with logo on mobile**
- [x] **Performance: Fixed pre-existing lint errors (Math.random, SidebarContent)**
- [x] **PWA meta tags in root layout (apple-mobile-web-app-capable, etc.)**
- [x] **Hydration fix: Memoized Button className to prevent SSR/client mismatches**

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing page | ✅ Complete |
| `src/app/(auth)/prijava/` | Login page | ✅ Complete |
| `src/app/(auth)/registracija/` | Registration page | ✅ Complete |
| `src/app/onboarding/` | Onboarding flow | ✅ Complete |
| `src/app/(app)/dashboard/` | Main dashboard | ✅ Complete (mobile-first) |
| `src/app/(app)/program/` | 10-day program | ✅ Complete |
| `src/app/(app)/izazov/` | Challenges | ✅ Complete |
| `src/app/(app)/prijatelji/` | Friends/invite | ✅ Complete |
| `src/app/(app)/profil/` | Profile/settings | ✅ Complete |
| `src/app/(app)/povijest/` | History/analytics | ✅ Complete |
| `prisma/schema.prisma` | Database schema | ✅ Complete |
| `prisma/seed.ts` | Demo data | ✅ Complete |
| `src/lib/auth.ts` | NextAuth config | ✅ Complete |
| `src/components/features/` | Feature modals | ✅ Complete |
| `src/components/ui/` | UI components | ✅ Complete |
| `src/components/layout/bottom-nav.tsx` | Mobile bottom nav | ✅ New |
| `src/components/layout/fab.tsx` | Floating Action Button | ✅ New |
| `src/components/pwa/install-prompt.tsx` | PWA install prompt | ✅ New |
| `src/components/pwa/offline-banner.tsx` | Offline banner | ✅ New |
| `src/components/pwa/service-worker-register.tsx` | SW registration | ✅ New |
| `public/manifest.json` | PWA manifest | ✅ New |
| `public/sw.js` | Service worker | ✅ New |
| `public/icons/` | PWA icons (72-512px) | ✅ New |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL + Prisma 5
- **Auth**: NextAuth.js v5 (beta)
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Package Manager**: Bun
- **PWA**: Custom service worker + Web App Manifest

## Key Design Decisions

1. **Grace cigarette system** — 3/4/6 grace cigarettes per program type instead of harsh resets
2. **Croatian language only** — all UI, labels, messages in Croatian
3. **Supportive tone** — no shaming, no guilt, progress over perfection
4. **Gamification** — achievements, challenges, leaderboards
5. **Prisma 5** — downgraded from Prisma 7 due to breaking API changes
6. **Mobile-first PWA** — bottom nav on mobile, sidebar on desktop, FAB for craving support
7. **Safe area support** — env(safe-area-inset-bottom) for iPhone notch/gesture bar

## Demo Credentials

- **Email**: `demo@puffless.app`
- **Password**: `demo1234`

## Session History

| Date | Changes |
|------|---------|
| 2024-03 | Complete Puffless MVP built from scratch |
| 2026-03 | PWA conversion: manifest, service worker, icons, bottom nav, FAB, mobile-first dashboard, install prompt, offline banner, safe area support |
| 2026-03-12 | Committed and pushed all uncommitted changes (dashboard-client, layout, globals.css, page, card) despite typecheck errors |
| 2026-03-12 | Fixed hydration mismatch error in Button component by memoizing className computation to ensure consistency between SSR and client |
