"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  meta?: string;
}

export function PageHeader({ title, subtitle, meta }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <AnimateIn as="h1" className="text-3xl font-bold text-foreground sm:text-4xl">
        {title}
      </AnimateIn>
      {subtitle && (
        <AnimateIn delay={100} className="mt-2 text-zinc-400">
          {subtitle}
        </AnimateIn>
      )}
      {meta && (
        <AnimateIn delay={180} className="mt-1 text-sm text-zinc-500">
          {meta}
        </AnimateIn>
      )}
    </div>
  );
}
