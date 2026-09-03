import Link from "next/link";
import { Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#050510]">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2 text-zinc-400">
          <Film className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold text-white">MovieVerse</span>
          <span className="text-sm">— ISS GDipSA Team 8</span>
        </div>
        <div className="flex gap-6 text-sm text-zinc-500">
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
