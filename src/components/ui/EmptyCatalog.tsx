import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyCatalog({
  title = "Nothing to show yet",
  detail = "The movie catalog could not be loaded. Check that TMDB_API_KEY is set on the host, then refresh.",
  actionHref,
  actionLabel,
}: {
  title?: string;
  detail?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
        Catalog
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{detail}</p>
      {actionHref && actionLabel ? (
        <div className="mt-8">
          <Link href={actionHref}>
            <Button>{actionLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
