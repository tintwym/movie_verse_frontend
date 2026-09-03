import { HeroSkeleton, MovieGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <HeroSkeleton />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <MovieGridSkeleton />
      </div>
    </div>
  );
}
