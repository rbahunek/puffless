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
    <div className="min-h-screen bg-[#F7FAFC] flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <AppSidebar user={session.user} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <AppHeader user={session.user} />
        <main className="flex-1 p-3 sm:p-4 lg:p-8 max-w-7xl w-full mx-auto pb-safe-bottom">
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
