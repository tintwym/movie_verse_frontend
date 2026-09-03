import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-6 sm:px-8">
        <div className="flex min-w-0 items-center gap-2 text-zinc-400">
          <Film className="h-5 w-5 shrink-0 text-indigo-400" />
          <p className="truncate text-sm">
            <span className="font-semibold text-foreground">MovieVerse</span>
            <span> — ISS GDipSA Team 8</span>
          </p>
        </div>
        <div className="flex shrink-0 gap-5 text-sm text-zinc-500">
          <Link href="/discover" className="hover:text-zinc-300">
            Discover
          </Link>
          <Link href="/trending" className="hover:text-zinc-300">
            Trending
          </Link>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300"
          >
            TMDB
          </a>
        </div>
      </div>
    </footer>
  );
}
