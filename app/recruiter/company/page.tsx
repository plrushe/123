import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { requireRecruiter } from "@/lib/auth-guards";
import { SectionNav } from "@/components/SectionNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function RecruiterCompanyPage() {
  await requireRecruiter();

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recruiter", href: "/recruiter" }, { label: "Company" }]} />
          <PageHeader title="Company Profile" description="Manage school or company branding details for future public profile pages." />
          <SectionNav items={[{ label: "Dashboard", href: "/recruiter" }, { label: "Company", href: "/recruiter/company" }, { label: "Jobs", href: "/recruiter/jobs" }, { label: "Applicants", href: "/recruiter/applicants" }, { label: "Candidates", href: "/recruiter/candidates" }]} />
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-sm text-slate-600">Company profile editing is coming soon.</p>
            <Link href="/recruiter/jobs" className="mt-3 inline-block text-sm font-medium text-slate-900 underline-offset-4 hover:underline">Manage your jobs</Link>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
