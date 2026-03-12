# Puffless 🚭

**Prestani pušiti uz podršku, napredak i male pobjede svaki dan.**

Puffless je moderna web aplikacija za pomoć pri prestanku pušenja. Koristi gamifikaciju, praćenje napretka, podršku pri žudnji i socijalne izazove — sve bez osjećaja krivnje.

---

## 🌟 Značajke

- **Praćenje napretka** — dani, preskočene cigarete, ušteđeni novac
- **Grace sustav** — jedna cigareta ne briše sav trud (3-6 grace cigareta po programu)
- **10-dnevni program** — strukturirani dnevni zadaci i refleksije
- **14 i 30-dnevni izazovi** — za napredne korisnike
- **Podrška pri žudnji** — vježbe disanja, 3-minutni izazov, zamjenske aktivnosti
- **Zdravstvene prekretnice** — vizualni prikaz oporavka tijela
- **Prijatelji i natjecanje** — pozivni kodovi, ljestvica, zajednički izazovi
- **Analitika** — okidači, rizična vremena, obrasci
- **Dostignuća** — gamificirani sustav nagrada

---

## 🛠 Tech Stack

| Tehnologija | Verzija | Svrha |
|-------------|---------|-------|
| Next.js | 16.x | React framework (App Router) |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS |
| Prisma | 5.x | ORM za PostgreSQL |
| NextAuth.js | 5.x (beta) | Autentikacija |
| Framer Motion | 12.x | Animacije |
| Lucide React | 0.5x | Ikone |
| Zod | 4.x | Validacija |
| React Hook Form | 7.x | Forme |
| date-fns | 4.x | Rad s datumima |
| bcryptjs | 3.x | Hashiranje lozinki |

---

## 🚀 Pokretanje lokalno

### Preduvjeti

- [Bun](https://bun.sh/) (preporučeni package manager)
- [PostgreSQL](https://www.postgresql.org/) (lokalno ili cloud)
- Node.js 20+

### 1. Kloniraj repozitorij

```bash
git clone <repo-url>
cd puffless
```

### 2. Instaliraj ovisnosti

```bash
bun install
```

### 3. Postavi environment varijable

Kopiraj `.env.example` u `.env` i popuni vrijednosti:

```bash
cp .env.example .env
```

Uredi `.env`:

```env
DATABASE_URL="postgresql://korisnik:lozinka@localhost:5432/puffless"
AUTH_SECRET="generiraj-tajni-kljuc-min-32-znaka"
NEXTAUTH_URL="http://localhost:3000"
```

Generiraj tajni ključ:
```bash
openssl rand -base64 32
```

### 4. Postavi bazu podataka

```bash
# Kreiraj tablice
bun run db:push

# Ili koristi migracije
bun run db:migrate
```

### 5. Popuni demo podatke (opcionalno)

```bash
bun run db:seed
```

Demo korisnik:
- **Email:** `demo@puffless.app`
- **Lozinka:** `demo1234`

### 6. Pokreni razvojni server

```bash
bun dev
```

Aplikacija je dostupna na [http://localhost:3000](http://localhost:3000).

---

## 📁 Struktura projekta

```
src/
├── app/
│   ├── (app)/              # Autenticirane stranice
│   │   ├── dashboard/      # Nadzorna ploča
│   │   ├── program/        # 10-dnevni program
│   │   ├── izazov/         # Izazovi (14/30 dana)
│   │   ├── prijatelji/     # Prijatelji i pozivnice
│   │   ├── profil/         # Profil i postavke
│   │   └── povijest/       # Povijest i analitika
│   ├── (auth)/             # Stranice za autentikaciju
│   │   ├── prijava/        # Prijava
│   │   └── registracija/   # Registracija
│   ├── api/                # API rute
│   │   ├── auth/           # NextAuth rute
│   │   ├── cigarettes/     # Bilježenje cigareta
│   │   ├── cravings/       # Bilježenje žudnji
│   │   ├── challenges/     # Izazovi
│   │   ├── invite/         # Pozivnice
│   │   ├── onboarding/     # Onboarding
│   │   ├── profile/        # Profil
│   │   └── program/        # Program
│   ├── onboarding/         # Onboarding flow
│   └── page.tsx            # Landing stranica
├── components/
│   ├── features/           # Feature komponente
│   │   ├── craving-modal   # Modal za žudnju
│   │   └── log-cigarette-modal # Modal za bilježenje
│   ├── layout/             # Layout komponente
│   │   ├── app-sidebar     # Bočna navigacija
│   │   └── app-header      # Zaglavlje
│   └── ui/                 # UI komponente
│       ├── badge           # Badge
│       ├── button          # Button
│       ├── card            # Card
│       └── input           # Input
├── lib/
│   ├── auth.ts             # NextAuth konfiguracija
│   ├── health-milestones.ts # Zdravstvene prekretnice
│   ├── prisma.ts           # Prisma klijent
│   ├── program-data.ts     # Podaci programa
│   └── utils.ts            # Pomoćne funkcije
└── proxy.ts                # Auth middleware
```

---

## 🗄 Baza podataka

### Prisma komande

```bash
# Generiraj Prisma klijent
bun prisma generate

# Primijeni shemu na bazu (development)
bun run db:push

# Kreiraj i primijeni migraciju
bun run db:migrate

# Otvori Prisma Studio
bun run db:studio

# Popuni demo podatke
bun run db:seed
```

### Modeli

- **User** — korisnik
- **UserProfile** — profil s postavkama pušenja
- **Program** — aktivni program (10/14/30 dana)
- **Challenge** — izazov s prijateljem
- **ChallengeParticipant** — sudionik izazova
- **CigaretteLog** — zabilježene cigarete
- **CravingLog** — zabilježene žudnje
- **DailyProgress** — dnevni napredak
- **InviteCode** — pozivni kodovi
- **Achievement** — dostignuća
- **UserAchievement** — dostignuća korisnika
- **HealthMilestoneProgress** — zdravstvene prekretnice

---

## 🔐 Autentikacija

Koristi NextAuth.js v5 s Credentials providerom (email/lozinka).

### Rute

- `POST /api/auth/register` — registracija
- `POST /api/auth/[...nextauth]` — NextAuth handler
- `GET /api/auth/[...nextauth]` — NextAuth handler

### Zaštita ruta

Middleware (`src/proxy.ts`) štiti sve autenticirane rute i preusmjerava neprijavljene korisnike na `/prijava`.

---

## 🎨 Dizajn sustav

### Boje

| Varijabla | Vrijednost | Svrha |
|-----------|-----------|-------|
| Primary | `#2EC4B6` | Primarna boja |
| Secondary | `#4F7BFF` | Sekundarna boja |
| Accent | `#FFD166` | Nagrade, novac |
| Warning | `#FF8C42` | Grace cigarete |
| Background | `#F7FAFC` | Pozadina |
| Surface | `#FFFFFF` | Kartice |

### Tipografija

- **Naslovi:** Poppins (600-800)
- **Tekst:** Inter (400-600)

---

## 📊 Grace sustav

Puffless koristi "grace cigarete" umjesto strogog nula-ili-sve modela:

| Program | Grace cigarete |
|---------|---------------|
| 10-dnevni reset | 3 |
| 14-dnevni izazov | 4 |
| 30-dnevni izazov | 6 |

Kada korisnik zabilježi cigaretu:
1. Povećava se broj iskorištenih grace cigareta
2. Prikazuje se podržavajuća poruka
3. Program ostaje aktivan dok se ne prekorači limit
4. Ako se prekorači limit: status postaje "Potreban fokus" (ne "Propao")

---

## 🌍 Jezik

Cijela aplikacija je na **hrvatskom jeziku**. Sve poruke, labele, gumbi i sadržaj su na hrvatskom.

---

## 📝 Licenca

MIT

---

*Napravljeno s ❤️ za zdraviji život.*
