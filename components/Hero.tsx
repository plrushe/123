export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-20 lg:grid-cols-2 lg:items-center">
      <div className="space-y-7">
        <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Built for global ESL hiring
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find your next ESL role — or your next star teacher.
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-slate-600">
          TeachBoard connects schools, recruiters, and qualified ESL educators across the world in one streamlined platform.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            Browse ESL Jobs
          </button>
          <button className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
            Hire Teachers
          </button>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Trusted by leading schools</h3>
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-600">
          {[
            "Seoul Language Hub",
            "Tokyo Global Academy",
            "Madrid ESL Institute",
            "Dubai International School",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
