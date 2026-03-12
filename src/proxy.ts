import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const runtime = "edge"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isAuthPage = nextUrl.pathname.startsWith("/prijava") ||
    nextUrl.pathname.startsWith("/registracija")
  const isOnboarding = nextUrl.pathname.startsWith("/onboarding")
  const isAppPage = nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/program") ||
    nextUrl.pathname.startsWith("/izazov") ||
    nextUrl.pathname.startsWith("/prijatelji") ||
    nextUrl.pathname.startsWith("/profil") ||
    nextUrl.pathname.startsWith("/povijest")

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Redirect non-logged-in users away from app pages
  if (!isLoggedIn && (isAppPage || isOnboarding)) {
    return NextResponse.redirect(new URL("/prijava", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
