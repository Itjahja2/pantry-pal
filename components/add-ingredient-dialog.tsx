"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { addIngredient, uploadIngredientImage } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  quantity: z.coerce.number().int().min(0, "Quantity can't be negative"),
});

type FormValues = z.infer<typeof formSchema>;

export function AddIngredientDialog() {
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const form = useForm<z.input<typeof formSchema>, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", quantity: 1 },
  });

  function resetForm() {
    form.reset();
    setImageFile(null);
  }

  async function onSubmit(values: FormValues) {
    const result = await addIngredient(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.set("file", imageFile);
      const imageResult = await uploadIngredientImage(result.id, imageFormData);
      if (!imageResult.success) {
        toast.error(imageResult.error);
      }
    }

    toast.success("Ingredient added");
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button
            className="fixed bottom-6 right-6 z-40 h-12 gap-2 rounded-full px-5 text-base shadow-lg"
            aria-label="Add ingredient"
          />
        }
      >
        <PlusIcon className="size-5" />
        Add Ingredient
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an ingredient</DialogTitle>
          <DialogDescription>
            Type in the ingredient name and how much you have.
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-ingredient-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-name">Name</Label>
            <Input id="ingredient-name" className="border-black" {...form.register("name")} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-quantity">Quantity</Label>
            <Input
              id="ingredient-quantity"
              type="number"
              min={0}
              step={1}
              className="border-black"
              {...form.register("quantity")}
            />
            {form.formState.errors.quantity ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.quantity.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ingredient-image">Photo (optional)</Label>
            <div className="flex items-center gap-2">
              <label
                htmlFor="ingredient-image"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer border-black")}
              >
                Choose File
              </label>
              <span className="truncate text-sm text-muted-foreground">
                {imageFile?.name ?? "No file chosen"}
              </span>
            </div>
            <input
              id="ingredient-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-ingredient-form"
            disabled={form.formState.isSubmitting}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}