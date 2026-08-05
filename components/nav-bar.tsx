"use client";

import Link from "next/link";
import { LeafIcon } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Recipes", segment: null },
  { href: "/pantry", label: "Pantry", segment: "pantry" },
] as const;

export function NavBar() {
  const segment = useSelectedLayoutSegment();

  return (
    <nav className="border-b border-black/10 bg-[#C96A3D]">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 pt-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-heading text-2xl font-semibold text-white justify-self-start"
        >
          Pantry Pal
          <LeafIcon className="size-5 -rotate-12" />
        </Link>
        <div className="flex justify-self-center gap-1">
          {TABS.map((tab) => {
            const isActive = segment === tab.segment;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-t-lg px-4 py-2 text-lg font-medium border-b-2 -mb-px transition-colors",
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-white/70 hover:text-white"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        <div />
      </div>
    </nav>
  );
}
