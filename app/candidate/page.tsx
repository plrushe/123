import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import type { ApplicationStatus } from "@/lib/applications";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CandidateApplicationRow = {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    company_name: string;
  } | null;
};

type CandidateProfileRow = {
  headline: string | null;
  bio: string | null;
  current_location: string | null;
  tefl_status: string | null;
};

type CvFileRow = {
  file_name: string;
  uploaded_at: string;
};

const sidebarItems = ["Dashboard", "Profile", "Applications", "Saved Jobs", "Messages", "Alerts", "Settings"];

const statusLabel: Record<ApplicationStatus, string> = {
  submitted: "Applications",
  reviewing: "Under Review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

export default async function CandidatePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "candidate") redirect("/recruiter");

  const [applicationsResult, profileResult, cvResult] = await Promise.all([
    supabase
      .from("applications")
      .select("id, status, created_at, jobs(id, title, company_name)")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("candidate_profiles").select("headline, bio, current_location, tefl_status").eq("id", user.id).maybeSingle(),
    supabase.from("candidate_cv_files").select("file_name, uploaded_at").eq("candidate_id", user.id).order("uploaded_at", { ascending: false }).limit(1),
  ]);

  const applications = (applicationsResult.data ?? []) as unknown as CandidateApplicationRow[];
  const profile = (profileResult.data ?? null) as CandidateProfileRow | null;
  const latestCv = ((cvResult.data ?? []) as CvFileRow[])[0] ?? null;

  const statusCounts: Record<ApplicationStatus, number> = {
    submitted: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
  };

  for (const application of applications) {
    statusCounts[application.status] += 1;
  }

  const checklist = [
    { label: "Basic information", complete: Boolean(profile?.headline || profile?.bio) },
    { label: "Uploaded CV", complete: Boolean(latestCv) },
    { label: "TEFL certificate", complete: Boolean(profile?.tefl_status) },
    { label: "Current location", complete: Boolean(profile?.current_location) },
  ];

  const completedChecklistCount = checklist.filter((item) => item.complete).length;
  const profileCompletion = Math.round((completedChecklistCount / checklist.length) * 100);

  const displayName = user.user_metadata?.full_name ?? "Candidate";

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
              <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">{profileCompletion}% Profile complete</div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {(Object.keys(statusLabel) as ApplicationStatus[]).map((status) => (
                <article key={status} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-3xl font-bold text-amber-700">{statusCounts[status]}</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{statusLabel[status]}</p>
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
              {applications.length === 0 ? (
                <p className="text-sm text-slate-600">No applications yet. Start exploring open roles.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {applications.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-slate-700">
                      <p className="font-medium">{item.jobs?.title ?? "Job unavailable"}</p>
                      <p className="text-xs text-slate-500">{item.jobs?.company_name ?? "Unknown company"} • {statusLabel[item.status]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Your CV</h2>
                {latestCv ? (
                  <p className="mt-2 text-sm text-slate-600">{latestCv.file_name} • Updated {new Date(latestCv.uploaded_at).toLocaleDateString()}</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-600">No CV uploaded yet</p>
                )}
                <Link href="/candidate/profile" className="mt-3 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Update CV</Link>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Profile Checklist</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {checklist.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span>{item.complete ? "✅" : "○"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
