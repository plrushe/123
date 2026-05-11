import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateProfileForm } from "@/app/candidate/profile/CandidateProfileForm";
import type { CandidateProfile, CvFile } from "@/lib/candidate-profile";
import { CandidateShell } from "@/components/CandidateShell";

export default async function CandidateProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "candidate") redirect("/recruiter");

  const [{ data: profile }, { data: cvFile }] = await Promise.all([
    supabase.from("candidate_profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("candidate_cv_files").select("*").eq("candidate_id", user.id).order("uploaded_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <CandidateShell activeHref="/candidate/profile">
      <div className="rounded-2xl border border-amber-200 bg-white p-6">
        <h1 className="text-3xl font-bold text-slate-900">Candidate Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your teaching profile details and keep your CV up to date.</p>
      </div>
      <CandidateProfileForm profile={(profile as CandidateProfile | null) ?? null} cvFile={(cvFile as CvFile | null) ?? null} />
    </CandidateShell>
  );
}
