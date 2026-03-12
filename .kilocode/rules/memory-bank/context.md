# Active Context: Puffless — Quit Smoking App

## Current State

**App Status**: ✅ Complete MVP — Production-ready full-stack application

Puffless is a complete Croatian-language quit smoking web application built as a startup MVP.

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

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Landing page | ✅ Complete |
| `src/app/(auth)/prijava/` | Login page | ✅ Complete |
| `src/app/(auth)/registracija/` | Registration page | ✅ Complete |
| `src/app/onboarding/` | Onboarding flow | ✅ Complete |
| `src/app/(app)/dashboard/` | Main dashboard | ✅ Complete |
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

## Key Design Decisions

1. **Grace cigarette system** — 3/4/6 grace cigarettes per program type instead of harsh resets
2. **Croatian language only** — all UI, labels, messages in Croatian
3. **Supportive tone** — no shaming, no guilt, progress over perfection
4. **Gamification** — achievements, challenges, leaderboards
5. **Prisma 5** — downgraded from Prisma 7 due to breaking API changes

## Demo Credentials

- **Email**: `demo@puffless.app`
- **Password**: `demo1234`

## Session History

| Date | Changes |
|------|---------|
| 2024-03 | Complete Puffless MVP built from scratch |
