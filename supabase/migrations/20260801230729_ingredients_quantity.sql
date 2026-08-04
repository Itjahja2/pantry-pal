-- Replace the in_stock boolean with a quantity count, so Pantry tracks
-- how much of an ingredient you have, not just whether you have any.
alter table ingredients
  drop column in_stock,
  add column quantity integer not null default 0;