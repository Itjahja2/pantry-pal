-- Public bucket for recipe and ingredient photos. Uploads/deletes go through
-- the server using the secret key, same as every other write in this app;
-- the "public" flag just lets the browser load images directly by URL,
-- without needing a signed URL per request.
--
-- Suggested path convention (enforced in app code, not the DB):
--   images/recipes/<recipe id>.<ext>
--   images/ingredients/<ingredient id>.<ext>
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  5242880, -- 5 MiB
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;