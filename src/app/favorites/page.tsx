"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { UserMovieListContent } from "@/components/movies/UserMovieListPage";
import { backendApi } from "@/lib/api/backend";

export default function FavoritesPage() {
  return (
    <MainLayout>
      <UserMovieListContent
        title="My Favorites"
        subtitle="Movies you've saved"
        emptyMessage="You haven't favorited any movies yet."
        emptyCta={{ label: "Browse trending", href: "/trending" }}
        fetchIds={async () => {
          const { data } = await backendApi.interactions.getFavorites();
          return data;
        }}
      />
    </MainLayout>
  );
}
