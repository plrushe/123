import Link from "next/link";
import { notFound } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/jobs";
import { ApplyJobForm } from "@/app/jobs/[id]/ApplyJobForm";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!job) notFound();

  const selectedJob = job as Job;

  const isCandidate = user?.user_metadata?.role === "candidate";
  const isRecruiter = user?.user_metadata?.role === "recruiter";

  const { data: existingApplication } = isCandidate
    ? await supabase.from("applications").select("id").eq("job_id", id).eq("candidate_id", user.id).maybeSingle()
    : { data: null };

  return (
    <main>
      <PageContainer>
        <article className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{selectedJob.company_name}</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{selectedJob.title}</h1>
          <p className="mt-2 text-slate-600">{selectedJob.location}</p>
          {selectedJob.salary ? <p className="mt-2 font-medium text-slate-800">Salary: {selectedJob.salary}</p> : null}

          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            {selectedJob.employment_type ? <span className="rounded-full bg-slate-100 px-3 py-1">{selectedJob.employment_type}</span> : null}
            {selectedJob.visa_support ? <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Visa support</span> : null}
            {selectedJob.housing_provided ? <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">Housing provided</span> : null}
            {selectedJob.tefl_required ? <span className="rounded-full bg-violet-100 px-3 py-1 text-violet-700">TEFL required</span> : null}
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-wrap text-slate-700">{selectedJob.description}</p>
          </section>

          {selectedJob.requirements ? (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Requirements</h2>
              <p className="mt-2 whitespace-pre-wrap text-slate-700">{selectedJob.requirements}</p>
            </section>
          ) : null}

          {!user ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Please <Link href="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline">sign in</Link> as a candidate to apply.
            </div>
          ) : isRecruiter ? (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Only candidate accounts can apply to jobs.
            </div>
          ) : existingApplication ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              You already applied to this role.
            </div>
          ) : isCandidate ? (
            <ApplyJobForm jobId={id} />
          ) : null}
        </article>
      </PageContainer>
    </main>
  );
}
