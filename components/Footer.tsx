import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} TeachBoard. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/resources" className="hover:text-slate-700">Resources</Link>
          <Link href="/jobs" className="hover:text-slate-700">Jobs</Link>
          <Link href="/signup" className="hover:text-slate-700">Get started</Link>
        </div>
      </div>
    </footer>
  );
}
