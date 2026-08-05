# Pantry Pal — a recipe keeper that knows your pantry

## What we're building

A recipe keeper app. You save the recipes you want to hold onto, keep a
running list of what's in your pantry, and the app tells you — recipe by
recipe — whether you can actually cook it right now with what you have on
hand, or whether you're missing something. No hunting through recipes
wondering if you have everything; the app checks for you.

## Version 1

**Navigation:** a top nav bar with two tabs — **Recipes** and **Pantry**.

**Screens / actions:**

1. **Recipes (home)** — list of all saved recipes, each tagged **Can cook**
   or **Can't cook** based on your current Pantry. Add a recipe by typing
   its title, a short description, and the full recipe text (ingredients +
   steps); optionally attach a photo. Tap a recipe to view, edit, or delete
   it.
2. **Pantry** — list of ingredients you have on hand, each with a quantity
   you can adjust. Add a new ingredient by name and quantity, optionally
   with a photo; remove one you no longer track.

**How "Can I cook this?" works:** a recipe's full text is checked against
every ingredient name in your Pantry. If every pantry ingredient it
mentions is currently in stock (quantity > 0), it's tagged **Can cook** —
otherwise **Can't cook**. Presence-and-quantity only, no unit math.

**Data it stores:**

- `ingredients` — name, quantity, optional photo
- `recipes` — title, description, full recipe text, optional photo

## Later

- Import a recipe by pasting a URL — an AI call fetches the page and
  extracts the ingredient list automatically, instead of typing it in
- Smarter matching: recipes that need *more* of an ingredient than you
  currently have, not just presence
- Auto-deduct ingredients from Pantry when you mark a recipe as cooked
- Expiration dates / "use this soon" nudges
- Auto-generated shopping list for recipes you're a few ingredients short on
- Barcode scanning to add ingredients faster
- Recipe ratings / notes on how it turned out
