"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { backendApi } from "@/lib/api/backend";
import type { CommunityReview } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";

interface Props {
  movieId: number;
  refreshKey?: number;
}

export function CommunityReviews({ movieId, refreshKey = 0 }: Props) {
  const [reviews, setReviews] = useState<CommunityReview[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      backendApi.reviews.getForMovie(movieId).catch(() => ({ data: [] as CommunityReview[] })),
      backendApi.ratings.getAverage(movieId).catch(() => ({ data: null as number | null })),
    ]).then(([reviewsRes, avgRes]) => {
      if (cancelled) return;
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      setAverage(typeof avgRes.data === "number" ? avgRes.data : null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [movieId, refreshKey]);

  return (
    <Reveal className="mt-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Community Reviews</h2>
          <p className="mt-1 text-sm text-zinc-500">What MovieVerse users are saying</p>
        </div>
        {average != null && average > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-yellow-400">
            <Star className="h-4 w-4 fill-current" />
            <span>{average.toFixed(1)} community avg</span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/10 px-6 py-10 text-center text-sm text-zinc-500">
          No community reviews yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review, index) => (
            <li
              key={`${review.username}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-semibold text-indigo-300">
                  {(review.username || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{review.username}</p>
                  {review.edited && (
                    <p className="text-xs text-zinc-500">Edited</p>
                  )}
                </div>
                {review.rating != null && (
                  <span className="ml-auto flex items-center gap-1 text-sm text-yellow-400">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {review.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">{review.reviewText}</p>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
