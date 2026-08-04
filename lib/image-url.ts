import { supabase } from "@/lib/supabase";

export function getImagePublicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return supabase.storage.from("images").getPublicUrl(path).data.publicUrl;
}