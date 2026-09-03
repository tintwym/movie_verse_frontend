import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-zinc-400">Page not found</p>
        <Link href="/" className="mt-8">
          <Button>Go Home</Button>
        </Link>
      </div>
    </MainLayout>
  );
}
