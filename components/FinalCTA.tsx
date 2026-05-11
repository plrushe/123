import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl border border-amber-200 bg-amber-100 px-8 py-14 text-center text-slate-900 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Build your ESL career pipeline with TeachBoard</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-700">Whether you're searching for your next teaching opportunity or hiring at scale, TeachBoard gives you the tools to move faster.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-white">Get Started Free</Link>
          <Link href="/for-recruiters" className="rounded-full border border-amber-400 px-6 py-3 text-sm font-semibold text-amber-900">For Recruiters</Link>
        </div>
      </div>
    </section>
  );
}
