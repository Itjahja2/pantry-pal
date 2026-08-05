import { CircleCheckIcon, CircleXIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function CookStatusBadge({
  canCook,
  className,
}: {
  canCook: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        canCook
          ? "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300"
          : "border-red-300 bg-red-100 text-red-800 dark:border-red-500/40 dark:bg-red-500/20 dark:text-red-300",
        className
      )}
    >
      {canCook ? <CircleCheckIcon className="size-3.5" /> : <CircleXIcon className="size-3.5" />}
      {canCook ? "Can cook" : "Can't cook"}
    </span>
  );
}