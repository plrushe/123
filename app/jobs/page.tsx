import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const publishedJobs = (jobs ?? []) as Job[];

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <PageHeader title="ESL Jobs" description="Browse published teaching opportunities from schools and recruiters." />
          {publishedJobs.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-medium text-slate-900">No jobs published yet.</p>
              <p className="mt-2 text-sm text-slate-600">Check back soon for new ESL opportunities, or sign up to receive updates.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {publishedJobs.map((job) => (
                <article key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
                    {job.salary ? <p className="text-sm font-medium text-slate-700">{job.salary}</p> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{job.company_name} • {job.location}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                    {job.employment_type ? <span className="rounded-full bg-slate-100 px-2 py-1">{job.employment_type}</span> : null}
                    {job.visa_support ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Visa support</span> : null}
                    {job.housing_provided ? <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">Housing provided</span> : null}
                    {job.tefl_required ? <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">TEFL required</span> : null}
                  </div>
                  <Link href={`/jobs/${job.id}`} className="mt-4 inline-block text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">View details</Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </main>
  );
}
