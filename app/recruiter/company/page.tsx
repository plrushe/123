import Link from "next/link";
import { RecruiterShell } from "@/components/RecruiterShell";
import { PageHeader } from "@/components/PageHeader";
import { requireRecruiter } from "@/lib/auth-guards";

export default async function RecruiterCompanyPage() {
  await requireRecruiter();

  return (
    <RecruiterShell activeHref="/recruiter/company">
          <PageHeader title="Company Profile" description="Manage school or company branding details for future public profile pages." />
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <p className="text-sm text-slate-600">Company profile editing is coming soon.</p>
            <Link href="/recruiter/jobs" className="mt-3 inline-block text-sm font-medium text-slate-900 underline-offset-4 hover:underline">Manage your jobs</Link>
          </div>
    </RecruiterShell>
  );
}
