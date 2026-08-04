# Build Plan — Kitchen Inventory + "Can I Cook This?"

Three phases get to all of version 1 from IDEA.md. Each phase ends with
something you can check yourself in the browser before the next one starts.

---

## Phase 1 — Home tab: recipes (manual entry, full CRUD)

**What we build:**
- Home page *is* the recipe list — no separate landing/placeholder page.
- "Add recipe" form: name + a list of ingredient names, typed in manually.
- Edit an existing recipe from its detail screen.
- Delete a recipe, with a confirmation step before it's removed.

**Schema change:**
- New migration: `recipes` table (`id`, `name`, `source_url` nullable,
  `created_at`) and `recipe_ingredients` table (`id`, `recipe_id` references
  `recipes`, `ingredient_name` text) — free-text names so a recipe can list
  something you don't have yet (matters once Pantry exists in Phase 2).
- RLS enabled on both, no policies.

**Verify in browser:**
- Add a recipe manually, confirm it shows up in the list on Home. Edit it
  (change the name or an ingredient), then delete it and confirm it's gone
  from both the list and Supabase's Table Editor.

---

## Phase 2 — Pantry tab

**What we build:**
- Tab bar layout with two tabs: **Home** (recipes, from Phase 1) and
  **Pantry**.
- Pantry page: lists ingredients.
- Add a new ingredient by name, with a quantity.
- Delete an ingredient you no longer track.

**Schema change:**
- New migration: `ingredients` table — `id`, `name` (text, not null),
  `quantity` (integer, default 0), `created_at`.
- RLS enabled, no policies (per the standing migration workflow).

**Verify in browser:**
- Open the Pantry tab, add a few ingredients with quantities (e.g. "flour"
  x2, "eggs" x12), delete one, refresh the page — state should persist.
- Confirm the rows and quantity values look right in Supabase's Table
  Editor.

---

## Phase 3 — Visual design pass

**What we build:**
- Recipe and pantry cards: a consistent layout (image, title, key details),
  spacing, and hover/interaction states across both pages.
- Overall page layout: nav/tab bar structure, page margins, and grid for the
  card lists.
- A color bar/theme carried through the nav bar and key UI accents.
- Typography: pick and apply a heading font and a body font site-wide.

**Schema change:** none — this phase is purely visual, no new tables or
columns.

**Verify in browser:**
- Confirm recipe and pantry cards look and behave consistently on both
  pages, the color theme reads consistently across the nav bar and accents,
  and the chosen fonts are applied everywhere (headings and body text).

