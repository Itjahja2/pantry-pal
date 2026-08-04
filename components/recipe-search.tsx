"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CookStatusBadge } from "@/components/cook-status-badge";
import { cn } from "@/lib/utils";

export type SearchableRecipe = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  canCook: boolean;
};

type StatusFilter = "all" | "can-cook" | "cant-cook";

export function RecipeSearch({ recipes }: { recipes: SearchableRecipe[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesQuery =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "can-cook" && recipe.canCook) ||
        (statusFilter === "cant-cook" && !recipe.canCook);
      return matchesQuery && matchesStatus;
    });
  }, [recipes, query, statusFilter]);

  return (
    <>
      <div className="relative mx-auto mb-6 w-full max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="border-black bg-white pl-9"
        />
        <div className="absolute left-full top-0 ml-3 flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStatusFilter((current) => (current === "can-cook" ? "all" : "can-cook"))
            }
            className={cn(
              "border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
              statusFilter === "can-cook" && "ring-2 ring-emerald-500"
            )}
          >
            Can cook
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStatusFilter((current) => (current === "cant-cook" ? "all" : "cant-cook"))
            }
            className={cn(
              "border-red-300 bg-red-100 text-red-800 hover:bg-red-200",
              statusFilter === "cant-cook" && "ring-2 ring-red-500"
            )}
          >
            Can&apos;t cook
          </Button>
        </div>
      </div>

      {filtered.length ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((recipe) => (
            <li key={recipe.id}>
              <Card className="group/card relative flex flex-col gap-0 p-3 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View ${recipe.title}`}
                />
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                  {recipe.imageUrl ? (
                    <Image
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover"
                    />
                  ) : null}
                  <CookStatusBadge canCook={recipe.canCook} className="absolute left-2 top-2" />
                </div>
                <div className="pt-2">
                  <p className="line-clamp-2 font-heading text-lg font-semibold leading-snug">
                    {recipe.title}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted-foreground">No recipes match.</p>
      )}
    </>
  );
}