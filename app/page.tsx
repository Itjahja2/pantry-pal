import { supabase } from "@/lib/supabase";

// Render on the server for every request, so new rows show up on refresh.
// Without this, the deployed page would be a frozen snapshot from build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: ideas } = await supabase.from("ideas").select();

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-bold mb-4">💡 App Ideas</h1>
      <ul className="space-y-2">
        {ideas?.map((idea) => (
          <li key={idea.id} className="rounded border p-3">
            {idea.title}
          </li>
        ))}
      </ul>
    </main>
  );
}
