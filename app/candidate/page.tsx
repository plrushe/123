import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sidebarItems = [
  { label: "Dashboard", href: "/candidate", active: true },
  { label: "Applications", href: "/candidate/applications" },
  { label: "Saved Jobs", href: "/jobs" },
  { label: "Messages", href: "#", badge: "2" },
  { label: "Profile", href: "/candidate/profile" },
  { label: "CV & Documents", href: "/candidate/profile" },
  { label: "Settings", href: "#" },
];

const statCards = [
  {
    label: "Applications Submitted",
    value: "12",
    subtext: "Total applications submitted",
    iconColor: "bg-blue-600",
    lineColor: "text-blue-500",
  },
  {
    label: "Under Review",
    value: "4",
    subtext: "Currently under review",
    iconColor: "bg-amber-500",
    lineColor: "text-amber-500",
  },
  {
    label: "Shortlisted",
    value: "2",
    subtext: "Moved to next stage",
    iconColor: "bg-emerald-500",
    lineColor: "text-emerald-500",
  },
  {
    label: "Rejected",
    value: "1",
    subtext: "Not selected",
    iconColor: "bg-rose-500",
    lineColor: "text-rose-500",
  },
];

export default async function CandidatePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const role = data.user?.user_metadata?.role;

  if (role !== "candidate") redirect("/recruiter");

  const displayName = data.user?.user_metadata?.full_name ?? "Paul";

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px]">
        <aside className="w-64 border-r border-slate-200 bg-white px-5 py-8">
          <h2 className="text-3xl font-bold text-blue-700">TeachBoard</h2>
          <nav className="mt-10 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                  item.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">{item.badge}</span>
                ) : null}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-8">
          <header className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">Welcome back, {displayName}</h1>
                <p className="mt-3 text-lg text-slate-500">Here&apos;s what&apos;s happening with your job search.</p>
                <div className="mt-6 flex gap-3">
                  <button className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    Search Jobs
                  </button>
                  <button className="rounded-lg border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                    Upload CV
                  </button>
                </div>
              </div>

              <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">Profile Completion</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-blue-600 text-xl font-bold text-slate-800">
                    85%
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Great job! Your profile is almost complete.</p>
                    <Link href="/candidate/profile" className="mt-2 inline-block text-sm font-semibold text-blue-600">
                      Complete your profile →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Application Overview</h2>
              <Link href="/candidate/applications" className="text-sm font-semibold text-blue-600">
                View all applications →
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <article key={card.label} className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <span className={`h-8 w-8 rounded-full ${card.iconColor}`} />
                    <p className="font-semibold text-slate-800">{card.label}</p>
                  </div>
                  <p className="mt-5 text-5xl font-bold text-slate-900">{card.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{card.subtext}</p>
                  <svg className={`mt-4 h-8 w-full ${card.lineColor}`} viewBox="0 0 120 28" fill="none" aria-hidden>
                    <path d="M2 24C16 24 22 10 34 10C45 10 50 20 63 20C79 20 87 4 101 4C108 4 113 6 118 6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </article>
              ))}
            </div>
          </div>

          <form action={signOutAction} className="mt-6">
            <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Sign out
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
