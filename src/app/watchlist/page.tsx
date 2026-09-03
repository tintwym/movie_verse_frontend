"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { UserMovieListContent } from "@/components/movies/UserMovieListPage";
import { backendApi } from "@/lib/api/backend";

export default function WatchlistPage() {
  return (
    <MainLayout>
      <UserMovieListContent
        title="My Watchlist"
        subtitle="Shows and movies you plan to watch"
        emptyMessage="Your watchlist is empty."
        emptyCta={{ label: "Discover movies", href: "/discover" }}
        fetchIds={async () => {
          const { data } = await backendApi.interactions.getWatchlist();
          return data;
        }}
      />
    </MainLayout>
  );
}
