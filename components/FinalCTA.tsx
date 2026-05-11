import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-3xl bg-slate-900 px-8 py-14 text-center text-white shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Build your ESL career pipeline with TeachBoard</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Whether you're searching for your next teaching opportunity or hiring at scale, TeachBoard gives you the tools to move faster.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900">Get Started Free</Link>
          <Link href="/for-recruiters" className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-white">For Recruiters</Link>
        </div>
      </div>
    </section>
  );
}
