import Link from "next/link";
import { RecruiterShell } from "@/components/RecruiterShell";
import { PageHeader } from "@/components/PageHeader";
import { requireRecruiter } from "@/lib/auth-guards";
import { fetchRecruiterCandidates, parseRecruiterCandidateFilters } from "@/lib/recruiter-candidates";

type RecruiterCandidatesPageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function RecruiterCandidatesPage({ searchParams }: RecruiterCandidatesPageProps) {
  const { supabase } = await requireRecruiter();
  const filters = parseRecruiterCandidateFilters(searchParams);
  const { data: candidates, error } = await fetchRecruiterCandidates(supabase, filters);

  return (
    <RecruiterShell activeHref="/recruiter/candidates">
          <PageHeader title="Candidate Search" description="Browse and filter candidate profiles using structured details." />

          <form className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
            <input name="q" defaultValue={filters.q} placeholder="Search name or headline" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input name="targetLocation" defaultValue={filters.targetLocation} placeholder="Target location" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input name="teflStatus" defaultValue={filters.teflStatus} placeholder="TEFL status" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input name="degreeStatus" defaultValue={filters.degreeStatus} placeholder="Degree status" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <input name="visaStatus" defaultValue={filters.visaStatus} placeholder="Visa status" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <div className="md:col-span-5 flex gap-2">
              <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Apply filters</button>
              <Link href="/recruiter/candidates" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Clear</Link>
            </div>
          </form>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {!error && candidates.length === 0 ? (
              <p className="text-sm text-slate-600">No candidate profiles match your filters yet.</p>
            ) : (
              <ul className="space-y-4">
                {candidates.map((candidate) => (
                  <li key={candidate.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-slate-900">{candidate.profiles?.full_name ?? "Unnamed candidate"}</h2>
                        <p className="text-sm text-slate-600">{candidate.headline ?? "No headline yet"}</p>
                      </div>
                      <Link href={`/recruiter/candidates/${candidate.id}`} className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">View details</Link>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                      <p><span className="font-medium">Current:</span> {candidate.current_location ?? "—"}</p>
                      <p><span className="font-medium">Target:</span> {candidate.target_location ?? "—"}</p>
                      <p><span className="font-medium">Experience:</span> {candidate.years_experience ?? "—"} years</p>
                      <p><span className="font-medium">TEFL:</span> {candidate.tefl_status ?? "—"}</p>
                      <p><span className="font-medium">Availability:</span> {candidate.availability ?? "—"}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
    </RecruiterShell>
  );
}
