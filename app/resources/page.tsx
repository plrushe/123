import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

export default function ResourcesPage() {
  return <main><PageContainer><div className="mt-12"><PageHeader title="Resources" description="Helpful guides and updates for candidates and recruiters." /><div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-6"><p className="text-sm text-slate-600">Resource articles are coming soon.</p><div className="mt-4"><Link href="/jobs" className="text-sm font-medium text-slate-900 underline-offset-4 hover:underline">Browse current jobs</Link></div></div></div></PageContainer></main>;
}
