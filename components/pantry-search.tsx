"use client";

import { useMemo, useState } from "react";
import { CircleCheckIcon, CircleXIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { reorderIngredients } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { PantryImageThumbnail } from "@/components/pantry-image-thumbnail";
import { DeleteIngredientButton } from "@/components/delete-ingredient-button";
import { cn } from "@/lib/utils";

export type SearchableIngredient = {
  id: number;
  name: string;
  quantity: number;
  imageUrl: string | null;
};

type StockFilter = "all" | "in-stock" | "out-of-stock";

function SortableIngredientCard({
  ingredient,
  reorderable,
}: {
  ingredient: SearchableIngredient;
  reorderable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ingredient.id,
    disabled: !reorderable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...(reorderable ? attributes : {})}
      {...(reorderable ? listeners : {})}
    >
      <Card
        className={cn(
          "group/card w-full flex-row items-center justify-between gap-4 px-4 ring-0 shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-muted hover:shadow-lg",
          reorderable && "cursor-grab touch-none active:cursor-grabbing",
          isDragging && "opacity-50 shadow-lg"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <PantryImageThumbnail
            ingredientId={ingredient.id}
            initialImageUrl={ingredient.imageUrl}
            alt={ingredient.name}
          />
          <p className="min-w-0 flex-1 truncate font-heading text-lg font-medium">
            {ingredient.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <QuantityStepper id={ingredient.id} initialQuantity={ingredient.quantity} />
          <DeleteIngredientButton id={ingredient.id} />
        </div>
      </Card>
    </li>
  );
}

export function PantrySearch({ ingredients }: { ingredients: SearchableIngredient[] }) {
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [items, setItems] = useState(ingredients);
  const [prevIngredients, setPrevIngredients] = useState(ingredients);
  if (ingredients !== prevIngredients) {
    setPrevIngredients(ingredients);
    setItems(ingredients);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const canReorder = !query.trim() && stockFilter === "all";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((ingredient) => {
      const matchesQuery = !q || ingredient.name.toLowerCase().includes(q);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in-stock" && ingredient.quantity > 0) ||
        (stockFilter === "out-of-stock" && ingredient.quantity === 0);
      return matchesQuery && matchesStock;
    });
  }, [items, query, stockFilter]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const result = await reorderIngredients({ ids: newItems.map((item) => item.id) });
    if (!result.success) {
      toast.error(result.error);
      setItems(items);
    }
  }

  return (
    <>
      <div className="relative mx-auto mb-6 w-full max-w-md">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ingredients..."
          className="border-0 bg-white pl-9 shadow-md"
        />
        <div className="absolute left-full top-0 ml-3 flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStockFilter((current) => (current === "in-stock" ? "all" : "in-stock"))
            }
            className={cn(
              "border-0 bg-emerald-100 text-emerald-800 shadow-md hover:bg-emerald-200",
              stockFilter === "in-stock" && "ring-2 ring-emerald-500"
            )}
          >
            <CircleCheckIcon className="size-4" />
            In Stock
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStockFilter((current) => (current === "out-of-stock" ? "all" : "out-of-stock"))
            }
            className={cn(
              "border-0 bg-red-100 text-red-800 shadow-md hover:bg-red-200",
              stockFilter === "out-of-stock" && "ring-2 ring-red-500"
            )}
          >
            <CircleXIcon className="size-4" />
            Out of Stock
          </Button>
        </div>
      </div>

      {filtered.length ? (
        <DndContext
          id="pantry-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((ingredient) => ingredient.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-3">
              {filtered.map((ingredient) => (
                <SortableIngredientCard
                  key={ingredient.id}
                  ingredient={ingredient}
                  reorderable={canReorder}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-center text-muted-foreground">No ingredients match.</p>
      )}
    </>
  );
}