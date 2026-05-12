import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JobsBrowser } from "./JobsBrowser";
import type { PublicJob } from "./jobFilters";

type CompanyProfile = { recruiter_id: string; logo_url: string | null; company_tagline: string | null };

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, recruiter_id, title, company_name, location, salary, employment_type, visa_support, housing_provided, tefl_required, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const recruiterIds = [...new Set((jobs ?? []).map((job) => job.recruiter_id))];
  const { data: profiles } = recruiterIds.length
    ? await supabase.from("recruiter_company_profiles").select("recruiter_id, logo_url, company_tagline").in("recruiter_id", recruiterIds)
    : { data: [] as CompanyProfile[] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.recruiter_id, profile]));
  const publishedJobs = ((jobs ?? []) as PublicJob[]).map((job) => ({ ...job, ...profileMap.get(job.recruiter_id) }));

  return (
    <main className="min-h-screen py-10">
      <PageContainer>
        <div className="rounded-3xl border border-amber-200 bg-[#fffaf3] p-6 shadow-sm">
          <PageHeader title="Jobs" description="Browse published teaching opportunities from schools and recruiters." />
          <JobsBrowser initialJobs={publishedJobs} />
        </div>
      </PageContainer>
    </main>
  );
}
