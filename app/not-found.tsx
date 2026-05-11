import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";

export default function NotFound() {
  return (
    <main>
      <PageContainer>
        <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
          <p className="mt-3 text-slate-600">The page may have moved or is not available yet.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Home</Link>
            <Link href="/jobs" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Jobs</Link>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
