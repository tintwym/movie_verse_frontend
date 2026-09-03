"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Film,
  Search,
  User,
  Heart,
  Eye,
  Sparkles,
  LogOut,
  Sun,
  Moon,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/notifications/NotificationBell";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/tv", label: "TV" },
  { href: "/discover", label: "Discover" },
  { href: "/popular", label: "Popular" },
  { href: "/people", label: "People" },
];

export function DesktopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, username, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 hidden border-b bg-background/80 backdrop-blur-xl transition-all duration-300 lg:block",
        scrolled
          ? "border-white/10 shadow-lg shadow-black/20"
          : "border-white/5 shadow-none"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-6 xl:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2 font-bold text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white transition-transform duration-300 group-hover:scale-105">
            <Film className="h-5 w-5" />
          </div>
          <span className="text-lg">
            Movie<span className="text-indigo-400">Verse</span>
          </span>
        </Link>

        <nav className="flex min-w-0 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-2.5 py-2 text-sm font-medium transition xl:px-3",
                pathname === link.href
                  ? "bg-white/10 text-foreground"
                  : "text-zinc-400 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <>
              <Link
                href="/favorites"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-foreground"
              >
                Favorites
              </Link>
              <Link
                href="/recommended"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-foreground"
              >
                For You
              </Link>
            </>
          )}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto w-56 shrink-0 xl:w-72">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              placeholder="Search movies, TV, people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-zinc-500 outline-none focus:border-indigo-500/50"
            />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground transition hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                <span>{username}</span>
              </button>
              {menuOpen && (
                <div className="animate-scale-in absolute right-0 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-xl backdrop-blur-xl">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link
                    href="/favorites"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" /> Favorites
                  </Link>
                  <Link
                    href="/watchlist"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Bookmark className="h-4 w-4" /> Watchlist
                  </Link>
                  <Link
                    href="/watched"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Eye className="h-4 w-4" /> Watched
                  </Link>
                  <Link
                    href="/recommended"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Sparkles className="h-4 w-4" /> Recommended
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
