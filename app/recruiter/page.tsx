import Link from "next/link";
import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionNav } from "@/components/SectionNav";

export default async function RecruiterPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const role = data.user?.user_metadata?.role;

  if (role !== "recruiter") redirect("/candidate");

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Recruiter" }]} />
          <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Recruiter Dashboard"
            description="This area will summarize hiring activity, open roles, and recent candidate engagement."
          />
          <form action={signOutAction}>
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Sign out</button>
          </form>
        </div>
          <SectionNav items={[{ label: "Dashboard", href: "/recruiter" }, { label: "Company", href: "/recruiter/company" }, { label: "Jobs", href: "/recruiter/jobs" }, { label: "Applicants", href: "/recruiter/applicants" }, { label: "Candidates", href: "/recruiter/candidates" }]} />

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recruiter tools</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/recruiter/jobs" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Manage jobs</Link>
            <Link href="/recruiter/applicants" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Review applicants</Link>
            <Link href="/recruiter/candidates" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Browse candidates</Link>
          </div>
        </section>
        </div>
      </PageContainer>
    </main>
  );
}
