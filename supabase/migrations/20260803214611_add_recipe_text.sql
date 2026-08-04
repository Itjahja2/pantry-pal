-- Add a field for the actual recipe content (ingredients/steps), separate
-- from the short Descriptions blurb shown in the list.
alter table recipes
  add column "Recipe Text" text not null default '';