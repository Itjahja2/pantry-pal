import { supabase } from "@/lib/supabase";
import { getImagePublicUrl } from "@/lib/image-url";
import { AddIngredientDialog } from "@/components/add-ingredient-dialog";
import { PantrySearch } from "@/components/pantry-search";

// Render on the server for every request, so new rows show up on refresh.
export const dynamic = "force-dynamic";

export default async function Pantry() {
  const { data: ingredients } = await supabase.from("ingredients").select();

  const ingredientsWithImage = (ingredients ?? []).map((ingredient) => ({
    id: ingredient.id as number,
    name: ingredient.name as string,
    quantity: ingredient.quantity as number,
    imageUrl: getImagePublicUrl(ingredient.image_path),
  }));

  return (
    <main className="w-full mx-auto max-w-4xl p-8">
      <h1 className="font-heading text-2xl font-bold mb-4 text-center">🥫 Pantry</h1>
      {ingredientsWithImage.length ? (
        <PantrySearch ingredients={ingredientsWithImage} />
      ) : (
        <p className="text-center text-muted-foreground">No ingredients tracked yet.</p>
      )}
      <AddIngredientDialog />
    </main>
  );
}