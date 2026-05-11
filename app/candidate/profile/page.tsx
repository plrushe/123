import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CandidateProfileForm } from "@/app/candidate/profile/CandidateProfileForm";
import type { CandidateProfile, CvFile } from "@/lib/candidate-profile";

export default async function CandidateProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (user.user_metadata?.role !== "candidate") redirect("/recruiter");

  const [{ data: profile }, { data: cvFile }] = await Promise.all([
    supabase.from("candidate_profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("cv_files").select("*").eq("candidate_id", user.id).order("uploaded_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <PageHeader title="Candidate Profile" description="Manage your teaching profile details and keep your CV up to date." />
          <CandidateProfileForm profile={(profile as CandidateProfile | null) ?? null} cvFile={(cvFile as CvFile | null) ?? null} />
        </div>
      </PageContainer>
    </main>
  );
}
