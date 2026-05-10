const navLinks = ["Jobs", "For Teachers", "For Recruiters", "Pricing", "Resources"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-slate-900">TeachBoard</div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a key={link} href="#" className="transition hover:text-slate-900">
              {link}
            </a>
          ))}
        </nav>
        <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
          Post a Job
        </button>
      </div>
    </header>
  );
}
