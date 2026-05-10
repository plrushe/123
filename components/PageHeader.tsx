export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <section className="py-16">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-lg text-slate-600">{description}</p>
    </section>
  );
}
