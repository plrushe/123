"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { CITY_OPTIONS, COUNTRY_OPTIONS, DATE_POSTED_OPTIONS, DEFAULT_JOB_FILTERS, hasActiveFilters, JOB_TYPE_OPTIONS, SCHOOL_TYPE_OPTIONS, type JobFilterState, type PublicJob } from "./jobFilters";

const PAGE_SIZE = 10;

function JobCard({ job }: { job: PublicJob }) { return <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-900">{job.title}</h2><p className="mt-1 text-sm text-slate-600">{job.company_name} • {job.location}</p><Link href={`/jobs/${job.id}`} className="mt-3 inline-block text-sm font-semibold underline">View details</Link></article>; }

export function JobsBrowser({ initialJobs }: { initialJobs: PublicJob[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_JOB_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<JobFilterState>(DEFAULT_JOB_FILTERS);
  const [jobs, setJobs] = useState(initialJobs);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const cityChoices = filters.country && filters.country !== "International" ? CITY_OPTIONS[filters.country] ?? [] : [];
  const paginatedJobs = useMemo(() => jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [jobs, page]);
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));

  async function fetchJobs(next: JobFilterState) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (typeof v === "boolean") {
        if (v) params.set(k, "true");
      } else if (v.trim()) params.set(k, v.trim());
    });
    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = (await res.json()) as { jobs: PublicJob[] };
    return data.jobs;
  }

  function applyFilters(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const nextJobs = await fetchJobs(filters);
      setJobs(nextJobs);
      setAppliedFilters(filters);
      setPage(1);
    });
  }

  function clearFilters() {
    startTransition(async () => {
      const nextJobs = await fetchJobs(DEFAULT_JOB_FILTERS);
      setFilters(DEFAULT_JOB_FILTERS);
      setAppliedFilters(DEFAULT_JOB_FILTERS);
      setJobs(nextJobs);
      setPage(1);
    });
  }

  return <>
    <div className="mt-6 flex justify-end"><button type="button" onClick={() => setIsOpen((v) => !v)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium">{isOpen ? "Hide filters" : "Show filters"}</button></div>
    {isOpen ? <form onSubmit={applyFilters} className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
      <label className="block text-sm font-medium">Keyword<input className="mt-1 w-full rounded-lg border px-3 py-2" value={filters.keyword} onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))} /></label>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Location (Country)<select className="mt-1 w-full rounded-lg border px-3 py-2" value={filters.country} onChange={(e) => setFilters((p) => ({ ...p, country: e.target.value, city: "" }))}><option value="">Any</option>{COUNTRY_OPTIONS.map((country) => <option key={country}>{country}</option>)}</select></label>
        {cityChoices.length > 0 ? <label className="text-sm font-medium">City<select className="mt-1 w-full rounded-lg border px-3 py-2" value={filters.city} onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}><option value="">Any</option>{cityChoices.map((city) => <option key={city}>{city}</option>)}</select></label> : null}
        <label className="text-sm font-medium">School Type<select className="mt-1 w-full rounded-lg border px-3 py-2" value={filters.school_type} onChange={(e) => setFilters((p) => ({ ...p, school_type: e.target.value }))}><option value="">Any</option>{SCHOOL_TYPE_OPTIONS.map((v) => <option key={v}>{v}</option>)}</select></label>
        <label className="text-sm font-medium">Job Type<select className="mt-1 w-full rounded-lg border px-3 py-2" value={filters.job_type} onChange={(e) => setFilters((p) => ({ ...p, job_type: e.target.value }))}><option value="">Any</option>{JOB_TYPE_OPTIONS.map((v) => <option key={v}>{v}</option>)}</select></label>
        <label className="text-sm font-medium">Date posted<select className="mt-1 w-full rounded-lg border px-3 py-2" value={filters.posted_within_days} onChange={(e) => setFilters((p) => ({ ...p, posted_within_days: e.target.value }))}><option value="">Any time</option>{DATE_POSTED_OPTIONS.map((d) => <option key={d} value={String(d)}>Last {d} days</option>)}</select></label>
      </div>
      <fieldset className="mt-4"><legend className="text-sm font-medium">Extras</legend><div className="mt-2 grid gap-2 md:grid-cols-2">{([
        ["housing_provided", "Housing provided"],
        ["verified_recruiter", "Verified recruiter"],
        ["tefl_required", "TEFL required"],
        ["pgce_required", "PGCE/PGDE required"],
      ] as const).map(([key, label]) => <label key={key} className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={filters[key]} onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.checked }))} />{label}</label>)}</div></fieldset>
      <div className="mt-4 flex gap-3"><button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Apply Filters</button><button type="button" onClick={clearFilters} className="rounded-lg border px-4 py-2 text-sm font-semibold">Clear Filters</button></div>
    </form> : null}

    <section className="mt-6" aria-live="polite"><p className="text-sm text-slate-700">{jobs.length === 0 ? "No jobs match your filters" : `${jobs.length} jobs found`}</p>{hasActiveFilters(appliedFilters) ? <p className="mt-1 text-xs text-slate-600">Active filters applied</p> : null}</section>
    {isPending ? <p className="mt-3 text-sm">Loading filtered jobs...</p> : null}
    {paginatedJobs.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed p-10 text-center"><p>No jobs found.</p></div> : <div className="mt-8 grid gap-4">{paginatedJobs.map((job) => <JobCard key={job.id} job={job} />)}</div>}
    <nav className="mt-6 flex items-center justify-between" aria-label="Jobs pagination"><button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded border px-3 py-1 text-sm disabled:opacity-50">Previous</button><p className="text-sm">Page {page} of {totalPages}</p><button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded border px-3 py-1 text-sm disabled:opacity-50">Next</button></nav>
  </>;
}
