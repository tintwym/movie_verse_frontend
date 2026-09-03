"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { UserMovieListContent } from "@/components/movies/UserMovieListPage";
import { backendApi } from "@/lib/api/backend";

export default function WatchedPage() {
  return (
    <MainLayout>
      <UserMovieListContent
        title="Watched"
        subtitle="Movies you've seen"
        emptyMessage="No watched movies yet."
        emptyCta={{ label: "Find something to watch", href: "/discover" }}
        fetchIds={async () => {
          const { data } = await backendApi.interactions.getWatched();
          return data;
        }}
      />
    </MainLayout>
  );
}
