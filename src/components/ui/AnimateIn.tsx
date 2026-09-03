"use client";

import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  variant?: "fade-up" | "fade" | "scale";
}

const variantClass: Record<NonNullable<AnimateInProps["variant"]>, string> = {
  "fade-up": "animate-fade-in-up",
  fade: "animate-fade-in",
  scale: "animate-scale-in",
};

export function AnimateIn({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  variant = "fade-up",
}: AnimateInProps) {
  return (
    <Tag
      className={cn("opacity-0", variantClass[variant], className)}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </Tag>
  );
}
