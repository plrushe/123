export function AudienceSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-indigo-600">For Teachers</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Land quality ESL roles faster</h3>
          <ul className="mt-5 space-y-3 text-slate-600">
            <li>• One profile for multiple applications</li>
            <li>• Transparent salary and benefits insights</li>
            <li>• Direct communication with hiring schools</li>
          </ul>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold text-orange-600">For Recruiters</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">Hire verified ESL talent at scale</h3>
          <ul className="mt-5 space-y-3 text-slate-600">
            <li>• Access a global pipeline of screened teachers</li>
            <li>• Promote openings to active candidates</li>
            <li>• Manage applicants in one hiring workspace</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
