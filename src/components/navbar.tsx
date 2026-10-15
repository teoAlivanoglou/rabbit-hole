"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSidebar } from "@/context/sidebar-context";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { toggleSidebar } = useSidebar();
  const [user, setUser] = useState<User | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  return (
    <header className="navbar bg-base-200 border-b border-base-300 px-4 flex justify-between items-center h-16">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          className="btn btn-ghost btn-square btn-sm"
        >
          <Menu className="size-5" />
        </button>
        <span className="font-bold text-lg tracking-tight">Rabbit Hole</span>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{user.email}</span>
            <button type="button" onClick={handleSignOut} className="btn btn-ghost btn-sm">
              Log Out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Log In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
