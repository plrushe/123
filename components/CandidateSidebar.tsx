import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";

const sidebarItems = [
  { label: "Dashboard", href: "/candidate" },
  { label: "Profile", href: "/candidate/profile" },
  { label: "Applications", href: "/candidate/applications" },
  { label: "Saved Jobs", href: "/candidate/saved-jobs" },
  { label: "Messages", href: "/candidate/messages" },
  { label: "Alerts", href: "/candidate/alerts" },
  { label: "Settings", href: "/candidate/settings" },
];

export function CandidateSidebar({ activeHref }: { activeHref: string }) {
  return (
    <aside className="rounded-3xl border border-amber-200 bg-[#efe4d2] p-4">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-4 py-3 text-sm ${
              activeHref === item.href ? "bg-[#f0d977] font-medium text-amber-900" : "text-slate-800 hover:bg-[#f2e6be]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={signOutAction} className="mt-10 border-t border-amber-300 pt-6">
        <button className="text-sm text-slate-800 hover:text-slate-900">Sign out</button>
      </form>
    </aside>
  );
}
