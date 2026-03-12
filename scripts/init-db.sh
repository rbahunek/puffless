#!/bin/bash
# Database initialization script for online app builders

echo "🔍 Checking DATABASE_URL..."

if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"localhost"* ]]; then
  echo "❌ DATABASE_URL nije postavljen ili pokazuje na localhost"
  echo ""
  echo "📝 UPUTE:"
  echo "1. Kreiraj besplatnu Neon PostgreSQL bazu: https://console.neon.tech/signup"
  echo "2. Kopiraj connection string"
  echo "3. Postavi DATABASE_URL environment variable u app builderu"
  echo "4. Restartaj aplikaciju"
  exit 1
fi

echo "✅ DATABASE_URL je postavljen"
echo "🔄 Pokrećem Prisma push..."

bun prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
  echo "✅ Baza uspješno inicijalizirana!"
else
  echo "❌ Greška pri inicijalizaciji baze"
  exit 1
fi
