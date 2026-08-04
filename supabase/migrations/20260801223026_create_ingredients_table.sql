-- Create the ingredients table (Pantry)
create table if not exists ingredients (
  id bigint primary key generated always as identity,
  name text not null,
  in_stock boolean not null default true,
  created_at timestamptz default now()
);

-- Lock the table down: Row Level Security on, with NO policies.
-- The public Data API returns nothing for this table — the only
-- way to the data is our own backend, which uses the secret key.
alter table ingredients enable row level security;
