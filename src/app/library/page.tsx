"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Bookmark, Eye, Sparkles, LogIn } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CustomListsPanel } from "@/components/library/CustomListsPanel";
import { useAuth } from "@/contexts/AuthProvider";
import { Button } from "@/components/ui/Button";

const items = [
  {
    href: "/favorites",
    label: "Favorites",
    description: "Movies you love",
    icon: Heart,
    color: "from-rose-500/20 to-pink-500/10",
  },
  {
    href: "/watchlist",
    label: "Watchlist",
    description: "Plan to watch",
    icon: Bookmark,
    color: "from-indigo-500/20 to-violet-500/10",
  },
  {
    href: "/watched",
    label: "Watched",
    description: "Already seen",
    icon: Eye,
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    href: "/recommended",
    label: "For You",
    description: "Personal picks",
    icon: Sparkles,
    color: "from-amber-500/20 to-orange-500/10",
  },
];

export default function LibraryPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  return (
    <MainLayout>
      <div className="mx-auto max-w-lg px-4 py-6 sm:max-w-7xl sm:px-8 sm:py-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">My Library</h1>
        <p className="mt-1 text-sm text-zinc-400">Your saved movies and lists</p>

        {!isLoggedIn ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <LogIn className="mx-auto h-10 w-10 text-indigo-400" />
            <p className="mt-4 text-zinc-300">Sign in to access your library</p>
            <Button className="mt-6" onClick={() => router.push("/login")}>
              Sign In
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} p-4 transition active:scale-[0.98] sm:p-5`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-6 w-6 text-white" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-zinc-400">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <CustomListsPanel />
          </>
        )}
      </div>
    </MainLayout>
  );
}
