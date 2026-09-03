"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Film, Search, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { cn } from "@/lib/utils";

export function MobileTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isSearch = pathname.startsWith("/search");

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050510]/90 backdrop-blur-xl lg:hidden">
      <div
        className="flex h-14 items-center justify-between gap-3 px-4"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
            <Film className="h-4 w-4" />
          </div>
          <span className="text-base">
            Movie<span className="text-indigo-400">Verse</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => router.push(isSearch ? "/" : "/search")}
            className={cn(
              "rounded-xl p-2.5 transition",
              isSearch
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-zinc-400 hover:bg-white/10 hover:text-white"
            )}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl p-2.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
