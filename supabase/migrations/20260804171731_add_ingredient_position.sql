-- Manual drag-to-reorder position for the Pantry list. Backfill existing
-- rows using their current id order so nothing visibly jumps on first load.
alter table ingredients
  add column position integer;

update ingredients
  set position = sub.row_number
  from (
    select id, row_number() over (order by id asc) as row_number
    from ingredients
  ) as sub
  where ingredients.id = sub.id;

alter table ingredients
  alter column position set not null;