-- Manual drag-to-reorder position for the Recipes grid, same pattern as
-- ingredients.position. Backfilled by id order; this replaces the old
-- "can cook floats to top" sort with a fully manual order going forward.
alter table recipes
  add column position integer;

update recipes
  set position = sub.row_number
  from (
    select id, row_number() over (order by id asc) as row_number
    from recipes
  ) as sub
  where recipes.id = sub.id;

alter table recipes
  alter column position set not null;