import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/10",
        className
      )}
    />
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <Skeleton className="aspect-[2/3] w-full max-w-[180px]" />
          <Skeleton className="mt-3 h-4 w-3/4 max-w-[140px]" />
          <Skeleton className="mt-2 h-4 w-1/2 max-w-[100px]" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-12 w-2/3 max-w-xl" />
        <Skeleton className="mt-4 h-4 w-32" />
        <Skeleton className="mt-4 h-16 w-full max-w-lg" />
        <Skeleton className="mt-6 h-12 w-40" />
      </div>
    </div>
  );
}
