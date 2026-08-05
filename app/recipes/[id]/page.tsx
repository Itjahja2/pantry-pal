import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { getImagePublicUrl } from "@/lib/image-url";
import { AddRecipeForm } from "@/components/add-recipe-form";

// Render on the server for every request, so edits show up on refresh.
export const dynamic = "force-dynamic";

export default async function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: recipe } = await supabase
    .from("recipes")
    .select()
    .eq("id", id)
    .single();

  if (!recipe) {
    notFound();
  }

  return (
    <main className="w-full mx-auto max-w-xl p-8">
      <AddRecipeForm
        recipe={{
          id: recipe.id,
          title: recipe.Title,
          description: recipe.Descriptions,
          ingredients: recipe.Ingredients,
          recipeText: recipe["Recipe Text"],
          imageUrl: getImagePublicUrl(recipe["Image Path"]),
        }}
      />
    </main>
  );
}