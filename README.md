# Puffless 🚭

**Prestani pušiti uz podršku, napredak i male pobjede svaki dan.**

Puffless je moderna **Progressive Web App (PWA)** za pomoć pri prestanku pušenja. Koristi gamifikaciju, praćenje napretka, podršku pri žudnji i socijalne izazove — sve bez osjećaja krivnje. Instalira se na mobitel kao nativna aplikacija.

---

## 📱 Progressive Web App (PWA)

Puffless je potpuno instalabilan kao PWA na mobilnim uređajima i desktop računalima.

### Što je PWA?

Progressive Web App je web aplikacija koja se ponaša kao nativna mobilna aplikacija:
- **Instalabilan** — dodaj na početni zaslon telefona
- **Offline podrška** — radi i bez internetske veze (prikazuje zadnje podatke)
- **Brzo učitavanje** — cachira statičke resurse
- **Push obavijesti** — (buduća nadogradnja)
- **Fullscreen** — radi bez adresne trake preglednika

### Instalacija na mobitel

#### Android (Chrome)
1. Otvori Puffless u Chrome pregledniku
2. Klikni na "Instaliraj Puffless" banner koji se pojavi
3. Ili: izbornik (⋮) → "Dodaj na početni zaslon"

#### iOS (Safari)
1. Otvori Puffless u Safari pregledniku
2. Klikni na gumb "Dijeli" (□↑)
3. Odaberi "Dodaj na početni zaslon"
4. Potvrdi instalaciju

#### Desktop (Chrome/Edge)
1. Klikni na ikonu instalacije u adresnoj traci
2. Ili: izbornik → "Instaliraj Puffless"

### Testiranje PWA lokalno

```bash
# Build produkcijsku verziju
bun build

# Pokreni produkcijski server
bun start
```

> ⚠️ Service Worker radi samo u produkcijskom buildu ili na HTTPS. Za lokalno testiranje koristi `bun start` umjesto `bun dev`.

### Podržani preglednici

| Preglednik | PWA Instalacija | Offline | Push obavijesti |
|-----------|----------------|---------|----------------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Safari (iOS 16.4+) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Edge (Desktop) | ✅ | ✅ | ✅ |
| Firefox | ❌ | ✅ | ✅ |
| Samsung Internet | ✅ | ✅ | ✅ |

---

## 🌟 Značajke

- **📱 Mobile-first dizajn** — optimizirano za mobitele, radi i na desktopu
- **🔽 Bottom navigacija** — brza navigacija palcem na mobilnim uređajima
- **⚡ FAB gumb** — brzi pristup podršci pri žudnji
- **📲 PWA instalacija** — dodaj na početni zaslon
- **🔌 Offline podrška** — radi bez interneta
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
| Tailwind CSS | 3.4.x | Utility-first CSS |
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

**⚠️ VAŽNO: `.env` datoteka je uključena u repozitorij sa placeholder vrijednostima. MORAŠ AŽURIRATI `DATABASE_URL`!**

Uredi `.env` i postavi svoju PostgreSQL connection string:

```env
DATABASE_URL="postgresql://korisnik:lozinka@localhost:5432/puffless"
AUTH_SECRET="puffless-super-secret-key-min-32-characters-long-change-this"
NEXTAUTH_URL="http://localhost:3000"
```

**Opcije za PostgreSQL bazu:**

1. **Lokalni PostgreSQL** (najjednostavnije za development):
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   createdb puffless
   
   # Linux
   sudo apt install postgresql
   sudo systemctl start postgresql
   sudo -u postgres createdb puffless
   ```

2. **Besplatni cloud PostgreSQL**:
   - [Neon](https://neon.tech) - besplatno 0.5GB
   - [Supabase](https://supabase.com) - besplatno 500MB
   - [Railway](https://railway.app) - besplatno 512MB

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
│   │   ├── app-sidebar     # Bočna navigacija (desktop)
│   │   ├── app-header      # Zaglavlje
│   │   ├── bottom-nav      # Donja navigacija (mobile)
│   │   └── fab             # Floating Action Button (mobile)
│   ├── pwa/                # PWA komponente
│   │   ├── install-prompt  # Prompt za instalaciju
│   │   ├── offline-banner  # Banner za offline stanje
│   │   └── service-worker-register # Registracija SW
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
