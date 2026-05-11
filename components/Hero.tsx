import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-16">
      <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Teach. Inspire. Explore the world.</h1>
            <p className="max-w-xl text-lg text-slate-600">Find ESL teaching jobs with trusted schools and recruiters worldwide.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/jobs" className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-600">Browse Jobs</Link>
              <Link href="/for-teachers" className="rounded-lg border border-amber-300 bg-white px-5 py-3 text-sm font-semibold text-amber-800 hover:bg-amber-100">For Teachers</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Quick Search</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input className="rounded-lg border border-amber-200 px-3 py-2 text-sm" placeholder="ESL Teacher" />
              <input className="rounded-lg border border-amber-200 px-3 py-2 text-sm" placeholder="Any location" />
              <input className="rounded-lg border border-amber-200 px-3 py-2 text-sm" placeholder="Any type" />
              <button className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">Search Jobs</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
