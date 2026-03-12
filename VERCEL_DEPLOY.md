# Deploy na Vercel 🚀

## Brzi početak (5 minuta)

### 1. Povežite GitHub repozitorij

1. Idite na [vercel.com](https://vercel.com)
2. Kliknite **"Add New Project"**
3. Odaberite GitHub repozitorij `puffless`
4. Kliknite **"Import"**

### 2. Postavite Environment Variables

U Vercel dashboardu, dodajte:

```
DATABASE_URL=postgresql://neondb_owner:npg_TGShD8vMFJ3d@ep-aged-recipe-adcvkxjs-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

AUTH_SECRET=puffless-super-secret-key-min-32-characters-long-change-this

NEXTAUTH_URL=https://your-app.vercel.app
```

> **Napomena**: `NEXTAUTH_URL` će biti automatski postavljen na vašu Vercel domenu nakon prvog deploya.

### 3. Deploy

Kliknite **"Deploy"** - Vercel će automatski:
- ✅ Instalirati dependencies (`bun install`)
- ✅ Generirati Prisma Client
- ✅ Build-ati Next.js aplikaciju
- ✅ Deploy-ati na globalnu CDN

### 4. Povežite domenu (opcionalno)

U **Settings > Domains** možete dodati custom domenu.

---

## Zašto Vercel?

✅ **Besplatno** za hobby projekte
✅ **Automatic deployments** svaki git push
✅ **Zero configuration** - radi out-of-the-box
✅ **Globalna CDN** - brzo svugdje
✅ **Podržava Node.js** runtime (potrebno za Prisma + NextAuth)
✅ **Preview deployments** za svaki pull request
✅ **Analytics** uključen besplatno

---

## Troubleshooting

### Build fails sa Prisma error

Provjerite da je `DATABASE_URL` ispravno postavljen u Environment Variables.

### NextAuth redirect error

Postavite `NEXTAUTH_URL` na vašu Vercel domenu (npr. `https://puffless.vercel.app`).

### Database ne radi

Provjerite da Neon baza nije paused (besplatni tier se pauzira nakon inaktivnosti).

---

**Need help?** Vercel dokumentacija: https://vercel.com/docs
