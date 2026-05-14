import Link from "next/link";
import { redirect } from "next/navigation";
import { RecruiterShell } from "@/components/RecruiterShell";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/applications";

type RecruiterApplicantRow = {
  id: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: string;
  jobs: {
    id: string;
    title: string;
  } | null;
  profiles: {
    email: string;
    full_name: string | null;
  } | null;
};

export default async function RecruiterApplicantsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "recruiter") redirect("/candidate");

  const { data: applications } = await supabase
    .from("applications")
    .select("id, cover_letter, status, created_at, jobs!inner(id, title), profiles!inner(email, full_name)")
    .eq("jobs.recruiter_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (applications ?? []) as RecruiterApplicantRow[];

  return (
    <RecruiterShell activeHref="/recruiter/applicants">
          <PageHeader title="Applicants" description="Review candidates who applied to your published jobs." />
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {rows.length === 0 ? (
              <p className="text-sm text-slate-600">No applications yet. Once candidates apply, they will appear here.</p>
            ) : (
              <ul className="space-y-4">
                {rows.map((application) => (
                  <li key={application.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-slate-900">{application.profiles?.full_name ?? "Unnamed candidate"}</h2>
                        <p className="text-sm text-slate-600">{application.profiles?.email ?? "No email"}</p>
                        <p className="mt-1 text-sm text-slate-700">
                          Applied to: {application.jobs ? <Link href={`/jobs/${application.jobs.id}`} className="underline-offset-4 hover:underline">{application.jobs.title}</Link> : "Unknown job"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">{application.status}</span>
                    </div>
                    {application.cover_letter ? (
                      <div className="mt-3 rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cover letter</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{application.cover_letter}</p>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
    </RecruiterShell>
  );
}
