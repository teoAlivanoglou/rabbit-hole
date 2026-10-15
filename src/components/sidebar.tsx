"use client";

import { useSidebar } from "@/context/sidebar-context";
import { Code, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const navItems = [
    {
      label: "Home",
      href: "/home",
      icon: <Home className="size-5 shrink-0" />,
    },
    {
      label: "Dev",
      href: "/dev",
      icon: <Code className="size-5 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`bg-base-200 border-r border-base-300 transition-all duration-300 ease-in-out flex flex-col shrink-0 ${
        isCollapsed ? "w-16" : "w-56"
      }`}
    >
      <nav className="p-3 grow">
        <ul className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center h-10 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-content font-medium"
                      : "hover:bg-base-300 text-base-content/80 hover:text-base-content"
                  } ${isCollapsed ? "tooltip tooltip-right" : ""}`}
                  data-tip={isCollapsed ? item.label : undefined}
                >
                  <div className="size-10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <span
                    className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-300 ${
                      isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 pr-3"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
