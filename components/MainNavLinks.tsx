"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "For Teachers", href: "/for-teachers" },
  { label: "For Recruiters", href: "/for-recruiters" },
  { label: "Resources", href: "/resources" },
];

export function MainNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link key={link.href} href={link.href} className={isActive ? "text-slate-900 underline underline-offset-4" : "text-slate-600 hover:text-slate-900"}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
