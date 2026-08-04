"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

type ActionResult<T extends object = object> =
  | ({ success: true } & T)
  | { success: false; error: string };

const recipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  recipeText: z.string().trim().optional(),
});

export async function addRecipe(input: {
  title: string;
  description?: string;
  recipeText?: string;
}): Promise<ActionResult<{ id: number }>> {
  const parsed = recipeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid recipe" };
  }

  const { data: last } = await supabase
    .from("recipes")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPosition = ((last?.position as number) ?? 0) + 1;

  const { data: inserted, error } = await supabase
    .from("recipes")
    .insert({
      Title: parsed.data.title,
      Descriptions: parsed.data.description || "",
      "Recipe Text": parsed.data.recipeText || "",
      position: nextPosition,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { success: false, error: error?.message ?? "Could not save recipe" };
  }

  revalidatePath("/");
  return { success: true, id: inserted.id as number };
}

const reorderRecipesSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
});

export async function reorderRecipes(input: { ids: number[] }): Promise<ActionResult> {
  const parsed = reorderRecipesSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  const results = await Promise.all(
    parsed.data.ids.map((id, index) =>
      supabase.from("recipes").update({ position: index + 1 }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { success: false, error: failed.error.message };
  }

  revalidatePath("/");
  return { success: true };
}

const updateRecipeSchema = z.object({
  id: z.coerce.number().int(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  recipeText: z.string().trim().optional(),
});

export async function updateRecipe(input: {
  id: number;
  title: string;
  description?: string;
  recipeText?: string;
}): Promise<ActionResult> {
  const parsed = updateRecipeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid recipe" };
  }

  const { error } = await supabase
    .from("recipes")
    .update({
      Title: parsed.data.title,
      Descriptions: parsed.data.description || "",
      "Recipe Text": parsed.data.recipeText || "",
    })
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${parsed.data.id}`);
  return { success: true };
}

const deleteRecipeSchema = z.object({
  id: z.coerce.number().int(),
});

export async function deleteRecipe(input: { id: number }): Promise<ActionResult> {
  const parsed = deleteRecipeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" };
  }

  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

const ingredientSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  quantity: z.coerce.number().int().min(0, "Quantity can't be negative"),
});

export async function addIngredient(input: {
  name: string;
  quantity: number;
}): Promise<ActionResult<{ id: number }>> {
  const parsed = ingredientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid ingredient" };
  }

  const { data: last } = await supabase
    .from("ingredients")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPosition = ((last?.position as number) ?? 0) + 1;

  const { data: inserted, error } = await supabase
    .from("ingredients")
    .insert({
      name: parsed.data.name,
      quantity: parsed.data.quantity,
      position: nextPosition,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    return { success: false, error: error?.message ?? "Could not save ingredient" };
  }

  revalidatePath("/pantry");
  return { success: true, id: inserted.id as number };
}

const reorderIngredientsSchema = z.object({
  ids: z.array(z.coerce.number().int()).min(1),
});

export async function reorderIngredients(input: { ids: number[] }): Promise<ActionResult> {
  const parsed = reorderIngredientsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid request" };
  }

  const results = await Promise.all(
    parsed.data.ids.map((id, index) =>
      supabase.from("ingredients").update({ position: index + 1 }).eq("id", id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) {
    return { success: false, error: failed.error.message };
  }

  revalidatePath("/pantry");
  return { success: true };
}

const updateQuantitySchema = z.object({
  id: z.coerce.number().int(),
  quantity: z.coerce.number().int().min(0, "Quantity can't be negative"),
});

export async function updateIngredientQuantity(input: {
  id: number;
  quantity: number;
}): Promise<ActionResult> {
  const parsed = updateQuantitySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid quantity" };
  }

  const { error } = await supabase
    .from("ingredients")
    .update({ quantity: parsed.data.quantity })
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/pantry");
  return { success: true };
}

const deleteIngredientSchema = z.object({
  id: z.coerce.number().int(),
});

export async function deleteIngredient(input: { id: number }): Promise<ActionResult> {
  const parsed = deleteIngredientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" };
  }

  const { error } = await supabase
    .from("ingredients")
    .delete()
    .eq("id", parsed.data.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/pantry");
  return { success: true };
}

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function extensionFor(mimeType: string) {
  return mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1];
}

async function uploadImageFile(file: File, path: string): Promise<{ error?: string }> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "Only PNG, JPEG, or WebP images are allowed" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Image must be under 5MB" };
  }

  const { error } = await supabase.storage
    .from("images")
    .upload(path, file, { contentType: file.type, upsert: true });

  return error ? { error: error.message } : {};
}

export async function uploadRecipeImage(recipeId: number, formData: FormData): Promise<ActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image to upload" };
  }

  const path = `recipes/${recipeId}.${extensionFor(file.type)}`;
  const uploaded = await uploadImageFile(file, path);
  if (uploaded.error) {
    return { success: false, error: uploaded.error };
  }

  const { error } = await supabase
    .from("recipes")
    .update({ "Image Path": path })
    .eq("id", recipeId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${recipeId}`);
  return { success: true };
}

export async function uploadIngredientImage(
  ingredientId: number,
  formData: FormData
): Promise<ActionResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Choose an image to upload" };
  }

  const path = `ingredients/${ingredientId}.${extensionFor(file.type)}`;
  const uploaded = await uploadImageFile(file, path);
  if (uploaded.error) {
    return { success: false, error: uploaded.error };
  }

  const { error } = await supabase
    .from("ingredients")
    .update({ image_path: path })
    .eq("id", ingredientId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/pantry");
  return { success: true };
}