import { AuthProvider } from "@/contexts/AuthProvider";
import { AnimateIn } from "@/components/ui/AnimateIn";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-mesh px-4 py-12">
        <AnimateIn variant="scale" className="w-full max-w-md">
          {children}
        </AnimateIn>
      </div>
    </AuthProvider>
  );
}
