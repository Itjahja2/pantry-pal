"use client";

import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { addRecipe, updateRecipe, deleteRecipe, uploadRecipeImage } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
  ingredients: z.string().trim().optional(),
  recipeText: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export type ExistingRecipe = {
  id: number;
  title: string;
  description?: string;
  ingredients?: string;
  recipeText?: string;
  imageUrl?: string | null;
};

export function AddRecipeForm({ recipe }: { recipe?: ExistingRecipe }) {
  const router = useRouter();
  const isEditing = Boolean(recipe);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: recipe?.title ?? "",
      description: recipe?.description ?? "",
      ingredients: recipe?.ingredients ?? "",
      recipeText: recipe?.recipeText ?? "",
    },
  });

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);

    if (!recipe) {
      // No recipe id yet — hold onto the file and upload it after Save creates the row.
      setPendingImageFile(file);
      return;
    }

    setIsUploadingImage(true);
    const imageFormData = new FormData();
    imageFormData.set("file", file);
    const result = await uploadRecipeImage(recipe.id, imageFormData);
    setIsUploadingImage(false);

    if (!result.success) {
      toast.error(result.error);
      setImageUrl(recipe.imageUrl ?? null);
      return;
    }
    toast.success("Image updated");
  }

  async function onSubmit(values: FormValues) {
    if (recipe) {
      const result = await updateRecipe({ id: recipe.id, ...values });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Recipe updated");
      router.push("/");
      return;
    }

    const result = await addRecipe(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    if (pendingImageFile) {
      const imageFormData = new FormData();
      imageFormData.set("file", pendingImageFile);
      const imageResult = await uploadRecipeImage(result.id, imageFormData);
      if (!imageResult.success) {
        toast.error(imageResult.error);
      }
    }

    toast.success("Recipe added");
    router.push("/");
  }

  async function handleDelete() {
    if (!recipe) return;
    setIsDeleting(true);
    const result = await deleteRecipe({ id: recipe.id });
    setIsDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Recipe deleted");
    setDeleteOpen(false);
    router.push("/");
  }

  return (
    <>
      <label className="group relative mb-6 flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-black bg-white">
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleImageChange}
          disabled={isUploadingImage}
        />
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 576px"
            className="object-cover"
            unoptimized={imageUrl.startsWith("blob:")}
          />
        ) : (
          <span className="text-sm text-muted-foreground">Add image</span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          {imageUrl ? "Change image" : "Add image"}
        </span>
      </label>

      <h1 className="font-heading text-2xl font-bold mb-6">
        {recipe ? recipe.title : "Add a recipe"}
      </h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-title" className="font-bold">Title</Label>
          <Input id="recipe-title" className="bg-white border-black" {...form.register("title")} />
          {form.formState.errors.title ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-description" className="font-bold">Description</Label>
          <Textarea id="recipe-description" className="bg-white border-black" {...form.register("description")} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-ingredients" className="font-bold">Ingredients</Label>
          <Textarea
            id="recipe-ingredients"
            rows={6}
            className="bg-white border-black"
            placeholder="One ingredient per line..."
            {...form.register("ingredients")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="recipe-text" className="font-bold">Recipe</Label>
          <Textarea
            id="recipe-text"
            rows={10}
            className="bg-white border-black"
            placeholder="Steps..."
            {...form.register("recipeText")}
          />
          <p className="text-xs text-muted-foreground">
            We check this text against your Pantry to tell whether you can cook it.
          </p>
        </div>
        <div className={cn("flex gap-2 pt-2", isEditing ? "justify-between" : "justify-end")}>
          {isEditing ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          ) : null}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isEditing ? "Save changes" : "Save"}
            </Button>
          </div>
        </div>
      </form>

      {recipe ? (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete {recipe.title} recipe?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Yes
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteOpen(false)}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                No
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}