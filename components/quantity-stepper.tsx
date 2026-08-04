"use client";

import { useState, useTransition } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { updateIngredientQuantity } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  id,
  initialQuantity,
}: {
  id: number;
  initialQuantity: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isPending, startTransition] = useTransition();

  function commit(next: number) {
    const clamped = Math.max(0, next);
    setQuantity(clamped);
    startTransition(async () => {
      const result = await updateIngredientQuantity({ id, quantity: clamped });
      if (!result.success) {
        toast.error(result.error);
        setQuantity(initialQuantity);
      }
    });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-lg border px-1 py-1",
        quantity > 0
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-red-500/30 bg-red-500/10"
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Decrease quantity"
        disabled={isPending || quantity <= 0}
        onClick={() => commit(quantity - 1)}
      >
        <MinusIcon />
      </Button>
      <Input
        type="number"
        min={0}
        step={1}
        value={quantity}
        disabled={isPending}
        onChange={(e) => {
          const next = Number(e.target.value);
          setQuantity(Number.isNaN(next) ? 0 : Math.max(0, next));
        }}
        onBlur={() => commit(quantity)}
        className={cn(
          "h-7 w-14 border-none bg-transparent text-center font-medium",
          quantity > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Increase quantity"
        disabled={isPending}
        onClick={() => commit(quantity + 1)}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}