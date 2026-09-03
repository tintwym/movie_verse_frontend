import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-foreground placeholder:text-zinc-500",
        "outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
