"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CircleCheckIcon, CircleXIcon, LeafIcon, SearchIcon, UtensilsIcon } from "lucide-react";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { reorderRecipes } from "@/app/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CookStatusBadge } from "@/components/cook-status-badge";
import { cn } from "@/lib/utils";

export type SearchableRecipe = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  canCook: boolean;
};

type StatusFilter = "all" | "can-cook" | "cant-cook";

function SortableRecipeCard({
  recipe,
  reorderable,
}: {
  recipe: SearchableRecipe;
  reorderable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: recipe.id,
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
          "group/card relative flex flex-col gap-0 p-3 ring-0 shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg",
          reorderable && "cursor-grab touch-none active:cursor-grabbing",
          isDragging && "opacity-50 shadow-lg"
        )}
      >
        <Link
          href={`/recipes/${recipe.id}`}
          className="absolute inset-0 z-10"
          aria-label={`View ${recipe.title}`}
        />
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {recipe.imageUrl ? (
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="relative flex size-full items-center justify-center bg-emerald-50">
              <LeafIcon className="absolute left-3 top-3 size-5 -rotate-12 text-emerald-800/10" />
              <LeafIcon className="absolute bottom-3 right-3 size-5 rotate-[160deg] text-emerald-800/10" />
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100/80">
                <UtensilsIcon className="size-7 text-emerald-800/60" />
              </div>
            </div>
          )}
          <CookStatusBadge canCook={recipe.canCook} className="absolute left-2 top-2" />
        </div>
        <div className="pt-2">
          <p className="line-clamp-2 font-heading text-lg font-semibold leading-snug">
            {recipe.title}
          </p>
        </div>
      </Card>
    </li>
  );
}

export function RecipeSearch({ recipes }: { recipes: SearchableRecipe[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [items, setItems] = useState(recipes);
  const [prevRecipes, setPrevRecipes] = useState(recipes);
  if (recipes !== prevRecipes) {
    setPrevRecipes(recipes);
    setItems(recipes);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const canReorder = !query.trim() && statusFilter === "all";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((recipe) => {
      const matchesQuery =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "can-cook" && recipe.canCook) ||
        (statusFilter === "cant-cook" && !recipe.canCook);
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    const result = await reorderRecipes({ ids: newItems.map((item) => item.id) });
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
          placeholder="Search recipes..."
          className="border-0 bg-white pl-9 shadow-md"
        />
        <div className="absolute left-full top-0 ml-3 flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStatusFilter((current) => (current === "can-cook" ? "all" : "can-cook"))
            }
            className={cn(
              "border-0 bg-emerald-100 text-emerald-800 shadow-md hover:bg-emerald-200",
              statusFilter === "can-cook" && "ring-2 ring-emerald-500"
            )}
          >
            <CircleCheckIcon className="size-4" />
            Can cook
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setStatusFilter((current) => (current === "cant-cook" ? "all" : "cant-cook"))
            }
            className={cn(
              "border-0 bg-red-100 text-red-800 shadow-md hover:bg-red-200",
              statusFilter === "cant-cook" && "ring-2 ring-red-500"
            )}
          >
            <CircleXIcon className="size-4" />
            Can&apos;t cook
          </Button>
        </div>
      </div>

      {filtered.length ? (
        <DndContext
          id="recipes-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((recipe) => recipe.id)}
            strategy={rectSortingStrategy}
          >
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((recipe) => (
                <SortableRecipeCard key={recipe.id} recipe={recipe} reorderable={canReorder} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="text-center text-muted-foreground">No recipes match.</p>
      )}
    </>
  );
}