import { redirect } from "next/navigation";
import { signOutAction } from "@/app/auth/actions";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function RecruiterPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const role = data.user?.user_metadata?.role;

  if (role !== "recruiter") redirect("/candidate");

  return (
    <main>
      <PageContainer>
        <div className="mt-12 flex items-start justify-between gap-4">
          <PageHeader
            title="Recruiter Dashboard"
            description="This area will summarize hiring activity, open roles, and recent candidate engagement."
          />
          <form action={signOutAction}>
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Sign out</button>
          </form>
        </div>
      </PageContainer>
    </main>
  );
}
