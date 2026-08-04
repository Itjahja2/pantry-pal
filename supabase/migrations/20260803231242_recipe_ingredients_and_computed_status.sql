-- Ingredients a recipe needs, matched by free-text name against the Pantry.
-- Lets us compute "can cook" instead of relying on a manually-set flag.
create table if not exists recipe_ingredients (
  id bigint primary key generated always as identity,
  recipe_id bigint not null references recipes(id) on delete cascade,
  ingredient_name text not null,
  created_at timestamptz default now()
);

alter table recipe_ingredients enable row level security;

-- Cook Status is now derived from Pantry stock instead of set manually.
alter table recipes drop column "Cook Status";