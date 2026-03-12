import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register"
import { OfflineBanner } from "@/components/pwa/offline-banner"

export const viewport: Viewport = {
  themeColor: "#2EC4B6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Puffless — Prestani pušiti uz podršku",
  description: "Puffless ti pomaže pratiti ušteđeni novac, prepoznati okidače, izdržati žudnju i graditi navike bez osjećaja krivnje.",
  keywords: ["prestani pušiti", "quit smoking", "zdravlje", "navike", "puffless"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Puffless",
  },
  openGraph: {
    title: "Puffless — Prestani pušiti uz podršku",
    description: "Pratite napredak, uštedite novac i izgradite zdravije navike korak po korak.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
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
        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Puffless" />
        <meta name="application-name" content="Puffless" />
        <meta name="msapplication-TileColor" content="#2EC4B6" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* Apple splash screens */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">
        <OfflineBanner />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
