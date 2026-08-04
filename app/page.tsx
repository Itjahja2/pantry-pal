import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { getImagePublicUrl } from "@/lib/image-url";
import { Button } from "@/components/ui/button";
import { RecipeSearch } from "@/components/recipe-search";

// Render on the server for every request, so new rows show up on refresh.
// Without this, the deployed page would be a frozen snapshot from build time.
export const dynamic = "force-dynamic";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

export default async function Home() {
  const [{ data: recipes }, { data: ingredients }] = await Promise.all([
    supabase.from("recipes").select().order("position", { ascending: true }),
    supabase.from("ingredients").select("name, quantity"),
  ]);

  const pantry = ingredients ?? [];

  const recipesWithStatus = (recipes ?? []).map((recipe) => {
    const recipeText = normalize(recipe["Recipe Text"] ?? "");
    const mentioned = pantry.filter((ingredient) =>
      recipeText.includes(normalize(ingredient.name))
    );
    const canCook =
      mentioned.length > 0 && mentioned.every((ingredient) => ingredient.quantity > 0);
    return {
      id: recipe.id as number,
      title: recipe.Title as string,
      description: (recipe.Descriptions as string) ?? "",
      imageUrl: getImagePublicUrl(recipe["Image Path"]),
      canCook,
    };
  });

  return (
    <main className="w-full mx-auto max-w-6xl p-8">
      <h1 className="font-heading text-2xl font-bold mb-4 text-center">📖 Recipes</h1>
      {recipesWithStatus.length ? (
        <RecipeSearch recipes={recipesWithStatus} />
      ) : (
        <p className="text-center text-muted-foreground">No recipes saved yet.</p>
      )}
      <Button
        render={<Link href="/recipes/new" aria-label="Add recipe" />}
        nativeButton={false}
        className="fixed bottom-6 right-6 z-40 h-12 gap-2 rounded-full px-5 text-base shadow-lg"
      >
        <PlusIcon className="size-5" />
        Add Recipe
      </Button>
    </main>
  );
}