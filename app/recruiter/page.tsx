import Link from "next/link";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@/lib/applications";
import type { JobStatus } from "@/lib/jobs";
import { signOutAction } from "@/app/auth/actions";
import { PageContainer } from "@/components/PageContainer";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionNav } from "@/components/SectionNav";

type RecruiterJobRow = {
  id: string;
  title: string;
  company_name: string;
  status: JobStatus;
  created_at: string;
};

type RecruiterApplicationRow = {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  jobs: {
    id: string;
    title: string;
  } | null;
  profiles: {
    full_name: string | null;
  } | null;
};

const jobStatusLabel: Record<JobStatus, string> = {
  published: "Published Jobs",
  draft: "Draft Jobs",
  closed: "Closed Jobs",
};

const applicationStatusLabel: Record<ApplicationStatus, string> = {
  submitted: "New Applications",
  reviewing: "Under Review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
};

export default async function RecruiterPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "recruiter") redirect("/candidate");

  const [jobsResult, applicationsResult] = await Promise.all([
    supabase.from("jobs").select("id, title, company_name, status, created_at").eq("recruiter_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("id, status, created_at, jobs!inner(id, title), profiles!inner(full_name)")
      .eq("jobs.recruiter_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const jobs = (jobsResult.data ?? []) as RecruiterJobRow[];
  const applications = (applicationsResult.data ?? []) as RecruiterApplicationRow[];

  const jobStatusCounts: Record<JobStatus, number> = {
    draft: 0,
    published: 0,
    closed: 0,
  };

  for (const job of jobs) {
    jobStatusCounts[job.status] += 1;
  }

  const applicationStatusCounts: Record<ApplicationStatus, number> = {
    submitted: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
  };

  for (const application of applications) {
    applicationStatusCounts[application.status] += 1;
  }

  const pipelineChecklist = [
    { label: "At least one published job", complete: jobStatusCounts.published > 0 },
    { label: "At least one application received", complete: applications.length > 0 },
    { label: "Reviewing active candidates", complete: applicationStatusCounts.reviewing + applicationStatusCounts.shortlisted > 0 },
    { label: "Role pipeline maintained", complete: jobStatusCounts.draft + jobStatusCounts.published > 0 },
  ];

  const displayName = user.user_metadata?.full_name ?? "Recruiter";
  const newApplications = applicationStatusCounts.submitted;

  return (
    <main>
      <PageContainer>
        <div className="mt-12 space-y-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recruiter" }]} />
          <SectionNav items={[{ label: "Dashboard", href: "/recruiter" }, { label: "Company", href: "/recruiter/company" }, { label: "Jobs", href: "/recruiter/jobs" }, { label: "Applicants", href: "/recruiter/applicants" }, { label: "Candidates", href: "/recruiter/candidates" }]} />

          <div className="rounded-2xl border border-amber-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Welcome back, {displayName}! 👋</h1>
                <p className="mt-1 text-sm text-slate-600">Here&apos;s a snapshot of your hiring pipeline and recruiter activity.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">{newApplications} New applications</div>
                <form action={signOutAction}>
                  <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign out</button>
                </form>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(Object.keys(jobStatusLabel) as JobStatus[]).map((status) => (
                <article key={status} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-3xl font-bold text-amber-700">{jobStatusCounts[status]}</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{jobStatusLabel[status]}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-amber-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Recent Applicants</h2>
                <Link href="/recruiter/applicants" className="text-sm font-semibold text-amber-700">View all</Link>
              </div>
              {applications.length === 0 ? (
                <p className="text-sm text-slate-600">No applications yet. Share your listings to start receiving applicants.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {applications.slice(0, 3).map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-slate-700">
                      <p className="font-medium">{item.profiles?.full_name ?? "Unnamed candidate"}</p>
                      <p className="text-xs text-slate-500">{item.jobs?.title ?? "Job unavailable"} • {applicationStatusLabel[item.status]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Application Pipeline</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {(Object.keys(applicationStatusLabel) as ApplicationStatus[]).map((status) => (
                    <li key={status} className="flex items-center justify-between">
                      <span>{applicationStatusLabel[status]}</span>
                      <span className="font-semibold text-slate-900">{applicationStatusCounts[status]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white p-5">
                <h2 className="font-semibold text-slate-900">Recruiter Checklist</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {pipelineChecklist.map((item) => (
                    <li key={item.label} className="flex items-center justify-between">
                      <span>{item.label}</span>
                      <span>{item.complete ? "✅" : "○"}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/recruiter/jobs" className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white">Manage jobs</Link>
                  <Link href="/recruiter/candidates" className="rounded-lg border border-amber-300 px-3 py-2 text-xs font-semibold text-amber-800">Browse candidates</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
