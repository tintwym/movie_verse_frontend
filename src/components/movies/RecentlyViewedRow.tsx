"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { posterUrl } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function RecentlyViewedRow() {
  const items = useRecentlyViewed();
  if (items.length === 0) return null;

  return (
    <Reveal className="px-4 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">Continue Browsing</h2>
            <p className="mt-1 text-sm text-zinc-500">Recently viewed titles</p>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {items.map((item) => (
            <Link
              key={`${item.mediaType}-${item.id}`}
              href={item.mediaType === "tv" ? `/tv/${item.id}` : `/movies/${item.id}`}
              className="group w-[120px] flex-shrink-0 sm:w-[140px]"
            >
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-white/10 transition duration-300 group-hover:ring-indigo-500/40">
                <Image
                  src={posterUrl(item.poster_path)}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="140px"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground group-hover:text-indigo-500">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
