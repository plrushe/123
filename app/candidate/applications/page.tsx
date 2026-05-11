import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateShell } from "@/components/CandidateShell";
import type { ApplicationStatus } from "@/lib/applications";

type CandidateApplicationRow = {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  jobs: {
    id: string;
    title: string;
    company_name: string;
    location: string;
  } | null;
};

export default async function CandidateApplicationsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "candidate") redirect("/recruiter");

  const { data: applications } = await supabase
    .from("applications")
    .select("id, status, created_at, jobs(id, title, company_name, location)")
    .eq("candidate_id", user.id)
    .order("created_at", { ascending: false });

  const rows = ((applications ?? []) as unknown) as CandidateApplicationRow[];

  return (
    <CandidateShell activeHref="/candidate/applications">
      <div className="rounded-2xl border border-amber-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
        <p className="mt-1 text-sm text-slate-600">Track the status of jobs you have applied to.</p>
      </div>

      <section className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
        {rows.length === 0 ? (
          <div>
            <p className="text-sm text-slate-600">You have not applied to any jobs yet. Browse open roles to get started.</p>
            <Link href="/jobs" className="mt-3 inline-block text-sm font-semibold text-amber-800 underline-offset-4 hover:underline">Browse jobs</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((application) => (
              <li key={application.id} className="rounded-xl border border-amber-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-900">{application.jobs?.title ?? "Job unavailable"}</h2>
                    <p className="text-sm text-slate-600">{application.jobs?.company_name ?? "Unknown company"} • {application.jobs?.location ?? "Unknown location"}</p>
                    <p className="mt-1 text-xs text-slate-500">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-800">{application.status}</span>
                </div>
                {application.jobs ? <Link href={`/jobs/${application.jobs.id}`} className="mt-3 inline-block text-sm font-medium text-amber-900 underline-offset-4 hover:underline">View job</Link> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </CandidateShell>
  );
}
