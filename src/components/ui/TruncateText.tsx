import { cn } from "@/lib/utils";

interface TruncateTextProps {
  children: string;
  /** 1 = single line with "...", 2+ = multi-line clamp */
  lines?: 1 | 2 | 3;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

export function TruncateText({
  children,
  lines = 2,
  className,
  as: Tag = "span",
}: TruncateTextProps) {
  const clampClass =
    lines === 1 ? "truncate" : lines === 2 ? "line-clamp-2" : "line-clamp-3";

  return (
    <Tag
      className={cn(clampClass, "break-words", className)}
      title={children}
    >
      {children}
    </Tag>
  );
}
