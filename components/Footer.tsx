import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-amber-200 bg-[#fffaf3]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} TeachBoard. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/resources" className="hover:text-amber-800">Resources</Link>
          <Link href="/jobs" className="hover:text-amber-800">Jobs</Link>
          <Link href="/signup" className="hover:text-amber-800">Get started</Link>
        </div>
      </div>
    </footer>
  );
}
