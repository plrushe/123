"use client";

export function ApplicantsWeekChart({ data }: { data: Array<{ day: string; applicants: number }> }) {
  const max = Math.max(1, ...data.map((d) => d.applicants));
  return <div className="mt-3 space-y-2">{data.map((d) => <div key={d.day} className="flex items-center gap-3 text-xs text-slate-700"><span className="w-10">{d.day}</span><div className="h-2 flex-1 rounded bg-slate-100"><div className="h-2 rounded bg-amber-500" style={{ width: `${(d.applicants / max) * 100}%` }} /></div><span className="w-4 text-right font-semibold">{d.applicants}</span></div>)}</div>;
}
