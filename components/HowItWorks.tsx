const steps = [
  {
    title: "Create your profile",
    description: "Teachers showcase qualifications and teaching style. Recruiters set hiring preferences.",
  },
  {
    title: "Match by fit",
    description: "Smart filters and role tags surface relevant candidates and opportunities quickly.",
  },
  {
    title: "Connect and hire",
    description: "Message, interview, and onboard through a seamless and organized hiring flow.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">How TeachBoard Works</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-emerald-600">Step {index + 1}</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
