import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sidebarItems = ["Dashboard", "Profile", "Applications", "Saved Jobs", "Messages", "Alerts", "Settings"];

export default async function CandidatePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const role = data.user?.user_metadata?.role;

  if (role !== "candidate") redirect("/recruiter");

  const displayName = data.user?.user_metadata?.full_name ?? "Alex";

  return (
    <main className="min-h-screen bg-[#f8f2e8] py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-4 rounded-3xl border border-amber-200 bg-[#fffaf3] p-4 shadow-sm lg:grid-cols-[220px,1fr]">
        <aside className="rounded-2xl border border-amber-100 bg-[#fff3e0] p-4">
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={item}
                href={item === "Applications" ? "/candidate/applications" : item === "Profile" ? "/candidate/profile" : "/candidate"}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${index === 0 ? "bg-amber-200 text-amber-900" : "text-slate-700 hover:bg-amber-100"}`}
              >
                {item}
              </Link>
            ))}
          </nav>
          <form action={signOutAction} className="mt-8 border-t border-amber-200 pt-4">
            <button className="text-sm font-medium text-slate-700 hover:text-slate-900">Sign out</button>
          </form>
        </aside>

        <section className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {displayName}! 👋</h1>
                <p className="mt-1 text-sm text-slate-600">Let&apos;s take the next step in your teaching journey.</p>
              </div>
              <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">70% Profile complete</div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {[
                ["12", "Applications"],
                ["4", "Under Review"],
                ["2", "Shortlisted"],
                ["1", "Rejected"],
              ].map(([value, label]) => (
                <article key={label} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-3xl font-bold text-amber-700">{value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{label}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-amber-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Recent Applications</h2>
                <Link href="/candidate/applications" className="text-sm font-semibold text-amber-700">View all</Link>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  "ESL Teacher — Primary School",
                  "ESL Teacher — Global Academy",
                  "Kindergarten Teacher",
                ].map((item) => (
                  <div key={item} className="rounded-lg border border-slate-200 p-3 text-slate-700">{item}</div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Your CV</h2>
                <p className="mt-2 text-sm text-slate-600">My_Resume.pdf • Updated 2 days ago</p>
                <button className="mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Update CV</button>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Profile Checklist</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>• Basic information</li>
                  <li>• Uploaded CV</li>
                  <li>• TEFL certificate</li>
                  <li>• Work experience</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
