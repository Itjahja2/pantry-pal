-- Store the storage object path (not a full URL) for each recipe/ingredient
-- photo, e.g. "recipes/12.jpg" or "ingredients/4.jpg" in the "images" bucket.
-- Null means no photo yet.
alter table recipes
  add column "Image Path" text;

alter table ingredients
  add column image_path text;