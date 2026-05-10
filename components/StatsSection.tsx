const stats = [
  { label: "Active ESL jobs", value: "1,200+" },
  { label: "Verified schools", value: "430+" },
  { label: "Countries hiring", value: "52" },
  { label: "Successful placements", value: "9,800+" },
];

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
