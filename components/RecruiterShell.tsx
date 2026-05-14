import type { ReactNode } from "react";
import { RecruiterSidebar } from "@/components/RecruiterSidebar";

export function RecruiterShell({ activeHref, children }: { activeHref: string; children: ReactNode }) {
  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-4 rounded-3xl border border-amber-200 bg-[#fffaf3] p-4 shadow-sm lg:grid-cols-[240px,1fr]">
        <RecruiterSidebar activeHref={activeHref} />
        <section className="space-y-4">{children}</section>
      </div>
    </main>
  );
}
