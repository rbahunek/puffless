import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Next.js 16 Proxy - runs on Node.js runtime (cannot be Edge)
export default function proxy(request: NextRequest) {
  const { nextUrl } = request
  
  // Check for auth token in cookies (simple check)
  const token = request.cookies.get("next-auth.session-token") || 
                request.cookies.get("__Secure-next-auth.session-token")
  
  const isLoggedIn = !!token

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
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)",
  ],
}
