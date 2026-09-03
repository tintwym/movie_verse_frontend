import { DesktopNavbar } from "@/components/layout/DesktopNavbar";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthProvider";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-full flex-1 flex-col">
        <DesktopNavbar />
        <MobileTopBar />
        <main className="flex-1 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
          {children}
        </main>
        <MobileBottomNav />
        <InstallPrompt />
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
