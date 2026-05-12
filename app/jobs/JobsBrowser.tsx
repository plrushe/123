"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  DEFAULT_JOB_FILTERS,
  EMPLOYMENT_TYPES,
  hasActiveFilters,
  type JobFilterState,
  type PublicJob,
} from "./jobFilters";

function JobCard({ job }: { job: PublicJob }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
        {job.salary ? <p className="text-sm font-medium text-slate-700">{job.salary}</p> : null}
      </div>
      <p className="mt-1 text-sm text-slate-600">{job.company_name} • {job.location}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
        {job.employment_type ? <span className="rounded-full bg-slate-100 px-2 py-1">{job.employment_type}</span> : null}
        {job.visa_support ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">Visa support</span> : null}
        {job.housing_provided ? <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">Housing provided</span> : null}
        {job.tefl_required ? <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">TEFL required</span> : null}
      </div>
      <Link href={`/jobs/${job.id}`} className="mt-4 inline-block text-sm font-semibold text-slate-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">View details</Link>
    </article>
  );
}

export function JobsBrowser({ initialJobs }: { initialJobs: PublicJob[] }) {
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_JOB_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<JobFilterState>(DEFAULT_JOB_FILTERS);
  const [jobs, setJobs] = useState<PublicJob[]>(initialJobs);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeFilterChips = useMemo(() => {
    const chips: string[] = [];
    if (appliedFilters.keyword.trim()) chips.push(`Keyword: ${appliedFilters.keyword.trim()}`);
    if (appliedFilters.location.trim()) chips.push(`Location: ${appliedFilters.location.trim()}`);
    if (appliedFilters.employment_type) chips.push(`Type: ${appliedFilters.employment_type}`);
    if (appliedFilters.visa_support) chips.push("Visa support");
    if (appliedFilters.housing_provided) chips.push("Housing provided");
    if (appliedFilters.tefl_required) chips.push("TEFL required");
    return chips;
  }, [appliedFilters]);

  async function fetchJobs(nextFilters: JobFilterState) {
    const params = new URLSearchParams();
    if (nextFilters.keyword.trim()) params.set("keyword", nextFilters.keyword.trim());
    if (nextFilters.location.trim()) params.set("location", nextFilters.location.trim());
    if (nextFilters.employment_type) params.set("employment_type", nextFilters.employment_type);
    if (nextFilters.visa_support) params.set("visa_support", "true");
    if (nextFilters.housing_provided) params.set("housing_provided", "true");
    if (nextFilters.tefl_required) params.set("tefl_required", "true");

    const response = await fetch(`/api/jobs?${params.toString()}`, { method: "GET" });
    if (!response.ok) throw new Error("Could not load jobs.");
    const payload = (await response.json()) as { jobs: PublicJob[] };
    return payload.jobs;
  }

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        setError(null);
        const nextJobs = await fetchJobs(filters);
        setJobs(nextJobs);
        setAppliedFilters(filters);
      } catch {
        setError("We could not load jobs right now. Please try again.");
      }
    });
  }

  function clearFilters() {
    startTransition(async () => {
      try {
        setError(null);
        const reset = { ...DEFAULT_JOB_FILTERS };
        const nextJobs = await fetchJobs(reset);
        setFilters(reset);
        setAppliedFilters(reset);
        setJobs(nextJobs);
      } catch {
        setError("We could not reset filters right now. Please try again.");
      }
    });
  }

  return (
    <>
      <form onSubmit={applyFilters} className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/60 p-5" aria-label="Filter jobs">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Keyword
            <input className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" value={filters.keyword} onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))} name="keyword" type="text" placeholder="Job title or company" />
          </label>
          <label className="text-sm font-medium text-slate-700">Location
            <input className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" value={filters.location} onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))} name="location" type="text" placeholder="City or country" />
          </label>
          <label className="text-sm font-medium text-slate-700">Employment type
            <select className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500" value={filters.employment_type} onChange={(e) => setFilters((prev) => ({ ...prev, employment_type: e.target.value }))} name="employment_type">
              <option value="">Any</option>
              {EMPLOYMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
        </div>
        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-slate-700">Extras</legend>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-700">
            {(["visa_support", "housing_provided", "tefl_required"] as const).map((key) => (
              <label key={key} className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-amber-600 focus-visible:ring-amber-500" checked={filters[key]} onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.checked }))} />
                {key === "visa_support" ? "Visa support" : key === "housing_provided" ? "Housing provided" : "TEFL required"}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Apply Filters</button>
          <button type="button" onClick={clearFilters} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">Clear Filters</button>
        </div>
      </form>

      <section className="mt-6" aria-live="polite">
        <p className="text-sm text-slate-700">{jobs.length === 0 ? "No jobs match your filters" : `${jobs.length} jobs found`}</p>
        {hasActiveFilters(appliedFilters) ? (
          <div className="mt-2 flex flex-wrap gap-2" aria-label="Active filters">
            {activeFilterChips.map((chip) => <span key={chip} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700">{chip}</span>)}
          </div>
        ) : null}
      </section>

      {isPending ? <p className="mt-4 text-sm text-slate-600">Loading filtered jobs...</p> : null}
      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-medium text-slate-900">No jobs found.</p>
          <p className="mt-2 text-sm text-slate-600">Try broadening your filters and apply again.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </>
  );
}
