import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateShell } from "@/components/CandidateShell";

export default async function CandidatesettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "candidate") redirect("/recruiter");

  return (
    <CandidateShell activeHref="/candidate/settings">
      <div className="rounded-2xl border border-amber-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-slate-900">settings</h1>
        <p className="mt-1 text-sm text-slate-600">This section is available in the unified candidate workspace sidebar.</p>
      </div>
    </CandidateShell>
  );
}
