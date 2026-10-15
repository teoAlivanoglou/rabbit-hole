"use client";

import { useSidebar } from "@/context/sidebar-context";
import { Menu } from "lucide-react";

export function Navbar() {
  const { toggleSidebar } = useSidebar();

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
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-10 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">RH</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
