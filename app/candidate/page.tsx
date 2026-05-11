import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SectionNav } from "@/components/SectionNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function CandidatePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const role = data.user?.user_metadata?.role;

  if (role !== "candidate") redirect("/recruiter");

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Candidate" }]} />
          <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Candidate Dashboard"
            description="This area will be the main home for teacher activity, recommendations, and progress."
          />
          <form action={signOutAction}>
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Sign out</button>
          </form>
        </div>
          <SectionNav items={[{ label: "Dashboard", href: "/candidate" }, { label: "Profile", href: "/candidate/profile" }, { label: "Applications", href: "/candidate/applications" }]} />
        </div>
      </PageContainer>
    </main>
  );
}
