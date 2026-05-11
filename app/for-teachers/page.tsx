import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

export default function ForTeachersPage() {
  return <main><PageContainer><div className="mt-12"><PageHeader title="For Teachers" description="Learn how TeachBoard helps ESL teachers build profiles, discover jobs, and track applications." /><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-700">Create an account to start building your profile and applying.</p><div className="mt-4 flex gap-3"><Link href="/signup" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Get started</Link><Link href="/jobs" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Browse jobs</Link></div></div></div></PageContainer></main>;
}
