"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type SectionNavItem = { label: string; href: string };

export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-4 flex flex-wrap gap-2">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
