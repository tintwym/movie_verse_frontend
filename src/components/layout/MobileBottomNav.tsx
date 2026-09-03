"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Compass,
  Library,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") },
  { href: "/discover", label: "Discover", icon: Compass, match: (p: string) => p.startsWith("/discover") || p.startsWith("/genre") },
  {
    href: "/library",
    label: "Library",
    icon: Library,
    match: (p: string) =>
      ["/library", "/favorites", "/watchlist", "/watched", "/recommended"].some((r) =>
        p.startsWith(r)
      ),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    match: (p: string) => p.startsWith("/profile") || p.startsWith("/login"),
  },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  // Hide on auth pages
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password")
  ) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      <div
        className="mx-auto flex max-w-lg items-stretch justify-around px-2 pt-2"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {tabs.map((tab) => {
          const href =
            tab.href === "/library" && !isLoggedIn ? "/login" : tab.href;
          const active = tab.match(pathname);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "flex min-w-[4rem] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition",
                active
                  ? "text-indigo-400"
                  : "text-zinc-500 active:scale-95"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition",
                  active && "bg-indigo-500/15"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              </span>
              <span className={cn("text-[10px] font-medium", active && "font-semibold")}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
