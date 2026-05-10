const featuredJobs = [
  { title: "ESL Teacher", company: "Bright Future Academy", location: "Seoul, South Korea", type: "Full-time" },
  { title: "Online English Instructor", company: "LinguaLive", location: "Remote", type: "Contract" },
  { title: "Academic Coordinator", company: "Global Speak Institute", location: "Bangkok, Thailand", type: "Full-time" },
];

export function FeaturedJobs() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured ESL Jobs</h2>
          <p className="mt-2 text-slate-600">Explore hand-picked openings from top schools and programs.</p>
        </div>
        <a href="#" className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline">
          View all jobs
        </a>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {featuredJobs.map((job) => (
          <article key={job.title + job.company} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">{job.type}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{job.title}</h3>
            <p className="mt-2 text-sm text-slate-700">{job.company}</p>
            <p className="mt-1 text-sm text-slate-500">{job.location}</p>
            <button className="mt-6 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
              View job
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
