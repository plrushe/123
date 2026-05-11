import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";

export default function ForRecruitersPage() {
  return <main><PageContainer><div className="mt-12"><PageHeader title="For Recruiters" description="Discover how TeachBoard helps recruiters post jobs and discover candidate profiles." /><div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm text-slate-700">Recruiter tools are available after sign up.</p><div className="mt-4 flex gap-3"><Link href="/signup" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create recruiter account</Link><Link href="/recruiter" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Go to recruiter area</Link></div></div></div></PageContainer></main>;
}
