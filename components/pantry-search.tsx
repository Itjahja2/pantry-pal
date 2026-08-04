"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QuantityStepper } from "@/components/quantity-stepper";
import { PantryImageThumbnail } from "@/components/pantry-image-thumbnail";
import { DeleteIngredientButton } from "@/components/delete-ingredient-button";

export type SearchableIngredient = {
  id: number;
  name: string;
  quantity: number;
  imageUrl: string | null;
};

export function PantrySearch({ ingredients }: { ingredients: SearchableIngredient[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ingredients;
    return ingredients.filter((ingredient) => ingredient.name.toLowerCase().includes(q));
  }, [ingredients, query]);

  return (
    <>
      <div className="relative mx-auto mb-6 max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ingredients..."
          className="border-black bg-white pl-9"
        />
      </div>

      {filtered.length ? (
        <ul className="flex flex-col gap-3">
          {filtered.map((ingredient) => (
            <li key={ingredient.id}>
              <Card className="group/card w-full flex-row items-center justify-between gap-4 px-4 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted hover:shadow-md">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <PantryImageThumbnail
                    ingredientId={ingredient.id}
                    initialImageUrl={ingredient.imageUrl}
                    alt={ingredient.name}
                  />
                  <p className="min-w-0 flex-1 truncate font-heading font-medium">
                    {ingredient.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <QuantityStepper id={ingredient.id} initialQuantity={ingredient.quantity} />
                  <DeleteIngredientButton id={ingredient.id} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted-foreground">No ingredients match.</p>
      )}
    </>
  );
}