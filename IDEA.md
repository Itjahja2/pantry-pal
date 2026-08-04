# Kitchen Inventory + "Can I Cook This?"

## What we're building

A single-user kitchen tool that tracks which ingredients you have on hand and
which recipes you know, and answers one question fast: *do I have what I need
to make this?* No accounts, no quantities to fuss over — just a checklist of
what's in the kitchen and a list of recipes to check it against.

## Version 1

**Navigation:** a bottom tab bar with two tabs — **Home** and **Pantry**.

**Screens / actions:**

1. **Home tab** — list of all saved recipes (added either by URL import or
   manually). Add a new one by pasting a recipe URL (an AI call fetches the
   page and extracts the ingredient list), or by typing the name and
   ingredients in yourself if the URL doesn't parse or you're recalling one
   from memory. Tapping a recipe opens its detail screen.
2. **Pantry tab** — list of ingredients, each toggleable in-stock /
   out-of-stock. Add a new ingredient by name; remove one you no longer track.
3. **Recipe detail / "Can I cook this?"** — reached by tapping a recipe from
   Home. Shows each of its ingredients marked have / missing, based on your
   current Pantry checklist. Presence only — no amounts, no unit math.

**Data it stores:**

- `ingredients` — name, in-stock (boolean)
- `recipes` — name, source URL (optional, if added via import)
- `recipe_ingredients` — links a recipe to the ingredient names it needs

## Later

- Quantities and units (e.g. "2 cups flour"), and matching recipes against
  *how much* you have, not just whether you have it
- Auto-deduct ingredients from inventory when you mark a recipe as cooked
- Expiration dates / "use this soon" nudges
- Auto-generated shopping list for recipes you're missing a few things for
- Multi-user accounts (so this could be shared with a household)
- Barcode scanning to add ingredients faster
- Recipe ratings / notes on how it turned out
