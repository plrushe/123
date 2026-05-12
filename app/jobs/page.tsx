import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { JobsBrowser } from "./JobsBrowser";
import type { PublicJob } from "./jobFilters";

export default async function JobsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title, company_name, location, salary, employment_type, visa_support, housing_provided, tefl_required, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const publishedJobs = (jobs ?? []) as PublicJob[];

  return (
    <main className="min-h-screen py-10">
      <PageContainer>
        <div className="rounded-3xl border border-amber-200 bg-[#fffaf3] p-6 shadow-sm">
          <PageHeader title="ESL Jobs" description="Browse published teaching opportunities from schools and recruiters." />
          <JobsBrowser initialJobs={publishedJobs} />
        </div>
      </PageContainer>
    </main>
  );
}
