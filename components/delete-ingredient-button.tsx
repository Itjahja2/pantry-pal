"use client";

import { useState } from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteIngredient } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function DeleteIngredientButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteIngredient({ id });
    setIsDeleting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Ingredient deleted");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Delete ingredient"
      disabled={isDeleting}
      onClick={handleDelete}
      className="shrink-0 text-destructive opacity-0 transition-opacity group-hover/card:opacity-100 hover:bg-destructive/10"
    >
      <Trash2Icon />
    </Button>
  );
}