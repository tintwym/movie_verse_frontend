"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import { tmdbApi } from "@/lib/api/tmdb";
import type { AppNotification } from "@/lib/types";
import { movieTitle } from "@/lib/types";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const [listRes, countRes] = await Promise.all([
        backendApi.notifications.list(),
        backendApi.notifications.unreadCount(),
      ]);
      setItems(listRes.data);
      setUnread(countRes.data.count);
    } catch {
      /* ignore */
    }
  }, [isLoggedIn]);

  const refreshFollowCredits = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const { data: follows } = await backendApi.follows.list();
      if (!follows.length) return;
      const credits = await Promise.all(
        follows.slice(0, 12).map(async (f) => {
          try {
            const person = await tmdbApi.getPerson(f.tmdbPersonId);
            const cast = person.combined_credits?.cast ?? [];
            const newest = [...cast]
              .filter((c) => c.release_date || c.first_air_date)
              .sort((a, b) =>
                (b.release_date || b.first_air_date || "").localeCompare(
                  a.release_date || a.first_air_date || ""
                )
              )[0];
            if (!newest) return null;
            const mediaType =
              newest.media_type === "tv" || newest.media_type === "movie"
                ? newest.media_type
                : newest.title || newest.original_title
                  ? "movie"
                  : "tv";
            return {
              tmdbPersonId: f.tmdbPersonId,
              creditId: newest.id,
              title: movieTitle(newest),
              mediaType,
              releaseDate: newest.release_date || newest.first_air_date,
            };
          } catch {
            return null;
          }
        })
      );
      const payload = credits.filter(Boolean) as NonNullable<(typeof credits)[number]>[];
      if (payload.length) {
        await backendApi.follows.checkCredits(payload);
      }
    } catch {
      /* ignore */
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    load();
    const id = window.setInterval(load, 60000);
    return () => window.clearInterval(id);
  }, [isLoggedIn, load]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!isLoggedIn) return null;

  const openPanel = async () => {
    const next = !open;
    setOpen(next);
    if (next) {
      await refreshFollowCredits();
      await load();
    }
  };

  const markAll = async () => {
    await backendApi.notifications.markAllRead();
    await load();
  };

  const onItemClick = async (n: AppNotification) => {
    if (!n.read) {
      await backendApi.notifications.markRead(n.id);
      await load();
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={openPanel}
        className="relative rounded-lg p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 shadow-xl backdrop-blur-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                No notifications yet
              </p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={n.linkUrl || "/notifications"}
                  onClick={() => onItemClick(n)}
                  className={cn(
                    "block border-b border-white/5 px-4 py-3 transition hover:bg-white/5",
                    !n.read && "bg-indigo-500/10"
                  )}
                >
                  <p className="text-sm font-medium text-white">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-zinc-400">{n.message}</p>
                </Link>
              ))
            )}
          </div>
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-white/10 px-4 py-3 text-center text-xs text-indigo-400 hover:bg-white/5"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
