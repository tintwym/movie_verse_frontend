"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import { tmdbApi } from "@/lib/api/tmdb";
import type { AppNotification } from "@/lib/types";
import { movieTitle } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const follows = await backendApi.follows.list();
      const credits = await Promise.all(
        follows.data.slice(0, 20).map(async (f) => {
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
            return {
              tmdbPersonId: f.tmdbPersonId,
              creditId: newest.id,
              title: movieTitle(newest),
              mediaType: newest.title || newest.original_title ? "movie" : "tv",
              releaseDate: newest.release_date || newest.first_air_date,
            };
          } catch {
            return null;
          }
        })
      );
      const payload = credits.filter(Boolean) as NonNullable<(typeof credits)[number]>[];
      if (payload.length) await backendApi.follows.checkCredits(payload);
      const { data } = await backendApi.notifications.list();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoading && isLoggedIn) load();
    if (!isLoading && !isLoggedIn) setLoading(false);
  }, [isLoading, isLoggedIn, load]);

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-zinc-400">Loading…</div>
      </MainLayout>
    );
  }

  if (!isLoggedIn) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-zinc-400">Sign in to see updates from people you follow.</p>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="mt-1 text-sm text-zinc-400">Follows, credits, and account updates</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => backendApi.notifications.markAllRead().then(load)}
          >
            Mark all read
          </Button>
        </div>
        <ul className="divide-y divide-white/5 rounded-xl border border-white/10">
          {items.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-zinc-500">
              Nothing here yet. Follow actors on People pages to get credit alerts.
            </li>
          ) : (
            items.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.linkUrl || "#"}
                  onClick={() => {
                    if (!n.read) backendApi.notifications.markRead(n.id).then(load);
                  }}
                  className={cn(
                    "block px-4 py-4 transition hover:bg-white/5",
                    !n.read && "bg-indigo-500/10"
                  )}
                >
                  <p className="font-medium text-white">{n.title}</p>
                  <p className="mt-1 text-sm text-zinc-400">{n.message}</p>
                  {n.createdAt && (
                    <p className="mt-2 text-xs text-zinc-600">{n.createdAt}</p>
                  )}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </MainLayout>
  );
}
