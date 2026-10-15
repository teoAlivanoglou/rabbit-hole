import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { Suspense } from "react";

async function TodosList() {
  await connection();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase.from("resources").select("user_id,title,description,created_at");

  return (
    <div>
      {data && data.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {data.map((item) => (
            <li key={item.created_at || item.title}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p className="text-base-content/70">No resources found for user.</p>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Todos</h1>
      <Suspense fallback={<p className="text-base-content/70">Loading todos...</p>}>
        <TodosList />
      </Suspense>
    </div>
  );
}
