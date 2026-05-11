import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span>/</span> : null}
            {item.href ? <Link href={item.href} className="hover:text-slate-700">{item.label}</Link> : <span className="text-slate-700">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
