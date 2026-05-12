import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { requireRecruiter } from "@/lib/auth-guards";
import { SectionNav } from "@/components/SectionNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CompanyProfileForm } from "./CompanyProfileForm";

export default async function RecruiterCompanyPage() {
  const { user } = await requireRecruiter();
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("recruiter_company_profiles")
    .select("company_name, company_tagline, logo_url")
    .eq("recruiter_id", user.id)
    .maybeSingle();

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recruiter", href: "/recruiter" }, { label: "Company" }]} />
          <PageHeader title="Company Profile" description="Manage your public branding details shown in job listings." />
          <SectionNav items={[{ label: "Dashboard", href: "/recruiter" }, { label: "Company", href: "/recruiter/company" }, { label: "Jobs", href: "/recruiter/jobs" }, { label: "Applicants", href: "/recruiter/applicants" }, { label: "Candidates", href: "/recruiter/candidates" }]} />
          <CompanyProfileForm
            initialCompanyName={profile?.company_name ?? ""}
            initialTagline={profile?.company_tagline ?? ""}
            initialLogoUrl={profile?.logo_url ?? ""}
          />
        </div>
      </PageContainer>
    </main>
  );
}
