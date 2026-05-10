import { redirect } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";
import { JobCreateForm } from "@/app/recruiter/jobs/JobCreateForm";

export default async function RecruiterJobsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "recruiter") redirect("/candidate");

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("recruiter_id", user.id)
    .order("created_at", { ascending: false });

  const recruiterJobs = (jobs ?? []) as Job[];

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <PageHeader title="Manage jobs" description="Create and manage your posted roles." />
          <JobCreateForm />
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Your existing jobs</h2>
            {recruiterJobs.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">No jobs yet. Create your first listing above.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recruiterJobs.map((job) => (
                  <li key={job.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{job.title}</h3>
                        <p className="text-sm text-slate-600">{job.company_name} • {job.location}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-700">{job.status}</span>
                    </div>
                    <div className="mt-3">
                      <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">View public page</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
