# Build Plan — Kitchen Inventory + "Can I Cook This?"

Three phases get to all of version 1 from IDEA.md. Each phase ends with
something you can check yourself in the browser before the next one starts.

---

## Phase 1 — Pantry tab

**What we build:**
- Bottom tab bar layout with two tabs: **Home** (placeholder for now) and
  **Pantry**.
- Pantry page: lists ingredients, each with an in-stock/out-of-stock toggle.
- Add a new ingredient by name; remove one you no longer track.

**Schema change:**
- New migration: `ingredients` table — `id`, `name` (text, not null),
  `in_stock` (boolean, default true), `created_at`.
- RLS enabled, no policies (per the standing migration workflow).

**Verify in browser:**
- Open the Pantry tab, add a few ingredients (e.g. "flour", "eggs"), toggle
  a couple to out-of-stock, refresh the page — state should persist.
- Confirm the rows and toggle values look right in Supabase's Table Editor.

---

## Phase 2 — Home tab: recipes (manual entry) + "Can I cook this?"

**What we build:**
- Home page: lists all saved recipes.
- "Add recipe" form: name + a list of ingredient names, typed in manually.
- Recipe detail screen (tap a recipe from Home): shows every ingredient the
  recipe needs, marked have / missing by checking each name against your
  current Pantry. Presence only — no quantities.

**Schema change:**
- New migration: `recipes` table (`id`, `name`, `source_url` nullable,
  `created_at`) and `recipe_ingredients` table (`id`, `recipe_id` references
  `recipes`, `ingredient_name` text) — free-text names so a recipe can list
  something you don't have yet (that's what "missing" means).
- RLS enabled on both, no policies.

**Verify in browser:**
- Add a recipe manually with a mix of ingredients you do and don't have in
  Pantry. Open its detail view and confirm the have/missing list matches
  reality. Check both new tables in Supabase's Table Editor.

---

## Phase 3 — Import a recipe by URL (AI extraction)

**What we build:**
- On the "Add recipe" flow, an option to paste a URL instead of typing
  ingredients by hand. A Server Action fetches the page and calls the Claude
  API to extract a recipe name + ingredient list, then saves it the same way
  a manual entry would.
- If extraction fails (blocked page, no recipe found, etc.), fall back to
  the manual entry form from Phase 2 — nothing is lost.

**Setup (new, one-time):** get an API key from
[console.anthropic.com](https://console.anthropic.com), add it to `.env` as
`ANTHROPIC_API_KEY` — same rules as `SUPABASE_SECRET_KEY`: server-side only,
never committed, never in a client component.

**Schema change:** none — reuses the Phase 2 tables (`source_url` already
supports this).

**Verify in browser:**
- Paste a real recipe URL into the import form, confirm a recipe appears on
  Home with a plausible ingredient list. Try a broken/unsupported URL and
  confirm it falls back to manual entry cleanly.

---

## Later (from IDEA.md — not building today)

- Quantities and units, and matching recipes against *how much* you have
- Auto-deduct ingredients from Pantry when a recipe is marked cooked
- Expiration dates / "use this soon" nudges
- Auto-generated shopping list for recipes you're a few ingredients short on
- Multi-user accounts (Auth), so this could be shared with a household
- Barcode scanning to add ingredients faster
- Recipe ratings / notes on how it turned out
