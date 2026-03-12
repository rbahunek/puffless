import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Puffless — Prestani pušiti uz podršku",
  description: "Puffless ti pomaže pratiti ušteđeni novac, prepoznati okidače, izdržati žudnju i graditi navike bez osjećaja krivnje.",
  keywords: ["prestani pušiti", "quit smoking", "zdravlje", "navike", "puffless"],
  openGraph: {
    title: "Puffless — Prestani pušiti uz podršku",
    description: "Pratite napredak, uštedite novac i izgradite zdravije navike korak po korak.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
