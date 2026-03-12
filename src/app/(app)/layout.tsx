import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { FloatingActionButton } from "@/components/layout/fab"
import { InstallPrompt } from "@/components/pwa/install-prompt"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/prijava")
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex justify-center">
      {/* Desktop Sidebar - hidden on mobile */}
      <AppSidebar user={session.user} />

      {/* Main content, centered and max-w-5xl */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 items-center">
        <AppHeader user={session.user} />
        <main className="flex-1 w-full max-w-5xl px-2 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 pb-safe-bottom">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />

      {/* Floating Action Button - mobile only */}
      <FloatingActionButton />

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  )
}
