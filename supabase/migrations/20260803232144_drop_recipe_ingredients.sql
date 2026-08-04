-- "Can cook" now scans the Recipe text box against Pantry ingredient names,
-- so the structured ingredients-needed list is no longer used.
drop table if exists recipe_ingredients;