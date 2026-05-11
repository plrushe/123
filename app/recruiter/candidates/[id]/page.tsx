import { notFound } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { requireRecruiter } from "@/lib/auth-guards";

type CandidateDetailPageProps = {
  params: { id: string };
};

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const { supabase } = await requireRecruiter();

  const { data: candidate } = await supabase
    .from("candidate_profiles")
    .select("headline, bio, country_of_origin, current_location, target_location, years_experience, tefl_status, degree_status, visa_status, availability, profiles!inner(full_name, email)")
    .eq("id", params.id)
    .maybeSingle();

  if (!candidate) notFound();

  const { data: cv } = await supabase
    .from("cv_files")
    .select("file_name, uploaded_at")
    .eq("candidate_id", params.id)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main>
      <PageContainer>
        <div className="mt-12">
          <PageHeader title={candidate.profiles?.full_name ?? "Candidate"} description="Structured profile details for recruiter review." />
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <div><dt className="font-semibold text-slate-900">Email</dt><dd>{candidate.profiles?.email ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Headline</dt><dd>{candidate.headline ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Country of origin</dt><dd>{candidate.country_of_origin ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Current location</dt><dd>{candidate.current_location ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Target location</dt><dd>{candidate.target_location ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Years of experience</dt><dd>{candidate.years_experience ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">TEFL status</dt><dd>{candidate.tefl_status ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Degree status</dt><dd>{candidate.degree_status ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Visa status</dt><dd>{candidate.visa_status ?? "—"}</dd></div>
              <div><dt className="font-semibold text-slate-900">Availability</dt><dd>{candidate.availability ?? "—"}</dd></div>
            </dl>

            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{candidate.bio ?? "No bio added yet."}</p>
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Latest CV metadata</p>
              {cv ? (
                <p className="mt-1 text-sm text-slate-700">{cv.file_name} (uploaded {new Date(cv.uploaded_at).toLocaleDateString()})</p>
              ) : (
                <p className="mt-1 text-sm text-slate-600">No CV uploaded yet.</p>
              )}
            </div>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
