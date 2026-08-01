-- Create the ideas table
create table if not exists ideas (
  id bigint primary key generated always as identity,
  title text not null,
  created_at timestamptz default now()
);

-- Seed 3 starter ideas, but only if the table is empty
insert into ideas (title)
select title from (
  values
    ('An app that rates my coffee'),
    ('AI plant doctor'),
    ('Split the bill without the math')
) as seed(title)
where not exists (select 1 from ideas);

-- Lock the table down: Row Level Security on, with NO policies.
-- The public Data API returns nothing for this table — the only
-- way to the data is our own backend, which uses the secret key.
alter table ideas enable row level security;
