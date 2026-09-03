"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";
import { backendApi } from "@/lib/api/backend";
import { tmdbApi } from "@/lib/api/tmdb";
import type { TvEpisode, TvProgressItem, TvSeasonSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface Props {
  tvId: number;
  seasons?: TvSeasonSummary[];
}

export function TvSeasonTracker({ tvId, seasons = [] }: Props) {
  const { isLoggedIn } = useAuth();
  const usableSeasons = useMemo(
    () => seasons.filter((s) => s.season_number > 0).sort((a, b) => a.season_number - b.season_number),
    [seasons]
  );
  const [activeSeason, setActiveSeason] = useState(usableSeasons[0]?.season_number ?? 1);
  const [episodes, setEpisodes] = useState<TvEpisode[]>([]);
  const [progress, setProgress] = useState<TvProgressItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const watchedKey = (season: number, episode: number) => `${season}-${episode}`;
  const watchedSet = useMemo(() => {
    const set = new Set<string>();
    for (const p of progress) {
      if (p.watched) set.add(watchedKey(p.seasonNumber, p.episodeNumber));
    }
    return set;
  }, [progress]);

  useEffect(() => {
    if (!usableSeasons.length) return;
    if (!usableSeasons.some((s) => s.season_number === activeSeason)) {
      setActiveSeason(usableSeasons[0].season_number);
    }
  }, [usableSeasons, activeSeason]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    tmdbApi
      .getTVSeason(tvId, activeSeason)
      .then((data) => {
        if (!cancelled) setEpisodes(data.episodes ?? []);
      })
      .catch(() => {
        if (!cancelled) setEpisodes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tvId, activeSeason]);

  useEffect(() => {
    if (!isLoggedIn) {
      setProgress([]);
      return;
    }
    backendApi.tvProgress
      .list(tvId)
      .then((res) => setProgress(res.data))
      .catch(() => setProgress([]));
  }, [isLoggedIn, tvId]);

  const toggleEpisode = async (episode: TvEpisode) => {
    if (!isLoggedIn) {
      setMessage("Sign in to track episodes");
      return;
    }
    const watched = !watchedSet.has(watchedKey(episode.season_number, episode.episode_number));
    const { data } = await backendApi.tvProgress.upsert({
      tmdbTvId: tvId,
      seasonNumber: episode.season_number,
      episodeNumber: episode.episode_number,
      watched,
    });
    setProgress((prev) => {
      const rest = prev.filter(
        (p) =>
          !(
            p.seasonNumber === data.seasonNumber &&
            p.episodeNumber === data.episodeNumber
          )
      );
      return watched ? [...rest, data] : rest;
    });
  };

  const markSeason = async () => {
    if (!isLoggedIn) {
      setMessage("Sign in to track episodes");
      return;
    }
    const nums = episodes.map((e) => e.episode_number);
    await backendApi.tvProgress.markSeason(tvId, activeSeason, nums);
    const { data } = await backendApi.tvProgress.list(tvId);
    setProgress(data);
  };

  if (!usableSeasons.length) return null;

  const watchedInSeason = episodes.filter((e) =>
    watchedSet.has(watchedKey(e.season_number, e.episode_number))
  ).length;

  return (
    <section className="mt-12 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Season tracker</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Mark episodes as you go
            {isLoggedIn && episodes.length > 0
              ? ` · ${watchedInSeason}/${episodes.length} this season`
              : ""}
          </p>
        </div>
        {isLoggedIn && (
          <Button size="sm" variant="secondary" onClick={markSeason}>
            Mark season watched
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {usableSeasons.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSeason(s.season_number)}
            className={cn(
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm transition",
              activeSeason === s.season_number
                ? "bg-indigo-500/20 text-indigo-300"
                : "bg-white/5 text-zinc-400 hover:text-white"
            )}
          >
            {s.name || `Season ${s.season_number}`}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-amber-400">{message}</p>}

      {loading ? (
        <p className="text-sm text-zinc-500">Loading episodes…</p>
      ) : (
        <ul className="divide-y divide-white/5 rounded-xl border border-white/10">
          {episodes.map((ep) => {
            const done = watchedSet.has(watchedKey(ep.season_number, ep.episode_number));
            return (
              <li
                key={ep.id}
                className="flex items-start gap-3 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => toggleEpisode(ep)}
                  className={cn(
                    "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border transition",
                    done
                      ? "border-indigo-400 bg-indigo-500/30 text-indigo-200"
                      : "border-white/15 text-transparent hover:border-indigo-400/50"
                  )}
                  aria-label={done ? "Unmark watched" : "Mark watched"}
                >
                  <Check className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {ep.episode_number}. {ep.name}
                  </p>
                  {ep.overview && (
                    <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{ep.overview}</p>
                  )}
                </div>
                {ep.air_date && (
                  <span className="flex-shrink-0 text-xs text-zinc-500">{ep.air_date}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
