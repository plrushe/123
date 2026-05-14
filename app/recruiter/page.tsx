import Link from "next/link";
import { redirect } from "next/navigation";
import type { ApplicationStatus } from "@/lib/applications";
import type { JobStatus } from "@/lib/jobs";
import { RecruiterShell } from "@/components/RecruiterShell";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ApplicantsWeekChart } from "@/components/recruiter/ApplicantsWeekChart";
import { calculateMatchScore } from "@/lib/match-score";

type RecruiterJobRow = { id: string; title: string; company_name: string; status: JobStatus; created_at: string; expires_at: string | null };
type RecruiterApplicationRow = { id: string; status: ApplicationStatus; created_at: string; jobs: { id: string; title: string; location: string | null; tefl_required: boolean | null; employment_type: string | null; visa_support: boolean | null } | null; profiles: { full_name: string | null } | null; candidate_profiles: { target_location: string | null; tefl_status: string | null; degree_status: string | null; years_experience: number | null; visa_status: string | null; availability: string | null; employment_type_preference: string | null } | null };

const jobStatusLabel = { published: "Active Jobs", draft: "Jobs Expiring Soon", closed: "Closed Jobs" } as const;
const applicationStatusLabel: Record<ApplicationStatus, string> = { submitted: "New Applicants", reviewing: "Under Review", shortlisted: "Whitelisted", rejected: "Rejected" };

export default async function RecruiterPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "recruiter") redirect("/candidate");

  const [jobsResult, applicationsResult] = await Promise.all([
    supabase.from("jobs").select("id, title, company_name, status, created_at, expires_at").eq("recruiter_id", user.id).order("created_at", { ascending: false }),
    supabase.from("applications").select("id, status, created_at, jobs!inner(id, title, location, tefl_required, employment_type, visa_support), profiles!inner(full_name), candidate_profiles(target_location, tefl_status, degree_status, years_experience, visa_status, availability, employment_type_preference)").eq("jobs.recruiter_id", user.id).order("created_at", { ascending: false }),
  ]);

  const jobs = (jobsResult.data ?? []) as RecruiterJobRow[];
  const applications = ((applicationsResult.data ?? []) as unknown as RecruiterApplicationRow[]).map((a) => ({ ...a, jobs: Array.isArray(a.jobs) ? a.jobs[0] ?? null : a.jobs, profiles: Array.isArray(a.profiles) ? a.profiles[0] ?? null : a.profiles, candidate_profiles: Array.isArray(a.candidate_profiles) ? a.candidate_profiles[0] ?? null : a.candidate_profiles }));
  const now = new Date();
  const twentyOneDaysAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);

  const jobStatusCounts: Record<JobStatus, number> = { draft: 0, published: 0, closed: 0 };
  for (const job of jobs) {
    const posted = new Date(job.created_at);
    const expired = posted.getTime() <= now.getTime() - 30 * 24 * 60 * 60 * 1000;
    if (expired || job.status === "closed") jobStatusCounts.closed += 1;
    else if (job.status === "published") jobStatusCounts.published += 1;
    else if (job.status === "draft" || posted <= twentyOneDaysAgo) jobStatusCounts.draft += 1;
  }

  const applicationStatusCounts: Record<ApplicationStatus, number> = { submitted: 0, reviewing: 0, shortlisted: 0, rejected: 0 };
  for (const a of applications) applicationStatusCounts[a.status] += 1;

  const weekCounts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const count = applications.filter((a) => a.created_at.slice(0, 10) === key).length;
    return { day: d.toLocaleDateString(undefined, { weekday: "short" }), applicants: count };
  });

  return <RecruiterShell activeHref="/recruiter"><div className="rounded-2xl border border-amber-200 bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.user_metadata?.full_name ?? "Recruiter"}! 👋</h1><p className="mt-1 text-sm text-slate-600">Here&apos;s a snapshot of your hiring pipeline and recruiter activity.</p></div><div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900">{applicationStatusCounts.submitted} New applicants</div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{(Object.keys(jobStatusLabel) as JobStatus[]).map((s) => <article key={s} className="rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-3xl font-bold text-amber-700">{jobStatusCounts[s]}</p><p className="mt-1 text-sm font-medium text-slate-700">{jobStatusLabel[s]}</p></article>)}</div></div><div className="grid gap-4 xl:grid-cols-[2fr,1fr]"><div className="rounded-2xl border border-amber-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-slate-900">Recent Applicants</h2><Link href="/recruiter/applicants" className="text-sm font-semibold text-amber-700">View all</Link></div>{applications.length===0? <p className="text-sm text-slate-600">No applications yet.</p> : <div className="space-y-3 text-sm">{applications.slice(0,3).map((item)=>{const match=calculateMatchScore({jobLocation:item.jobs?.location, targetLocation:item.candidate_profiles?.target_location, teflRequired:item.jobs?.tefl_required ?? false, teflStatus:item.candidate_profiles?.tefl_status, degreeStatus:item.candidate_profiles?.degree_status, yearsExperience:item.candidate_profiles?.years_experience, visaSupport:item.jobs?.visa_support ?? false, visaStatus:item.candidate_profiles?.visa_status, availability:item.candidate_profiles?.availability, employmentType:item.jobs?.employment_type, employmentPreference:item.candidate_profiles?.employment_type_preference}); return <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-slate-700"><p className="font-medium">{item.profiles?.full_name ?? "Unnamed candidate"}</p><p className="text-xs text-slate-500">{item.jobs?.title ?? "Job unavailable"} • {applicationStatusLabel[item.status]} • {match}% match</p><Link href={`/recruiter/candidates/${item.id}`} className="mt-2 inline-block text-xs font-semibold text-amber-700">View profile</Link></div>;})}</div>}</div><div className="space-y-4"><div className="rounded-2xl border border-amber-200 bg-white p-5"><h2 className="font-semibold text-slate-900">Applicants</h2><ul className="mt-3 space-y-2 text-sm text-slate-700">{(Object.keys(applicationStatusLabel) as ApplicationStatus[]).map((s)=><li key={s} className="flex items-center justify-between"><span>{applicationStatusLabel[s]}</span><span className="font-semibold text-slate-900">{applicationStatusCounts[s]}</span></li>)}</ul></div><div className="rounded-2xl border border-amber-200 bg-white p-5"><h2 className="font-semibold text-slate-900">Applicants (Past 7 Days)</h2><ApplicantsWeekChart data={weekCounts} /></div></div></div></RecruiterShell>;
}
