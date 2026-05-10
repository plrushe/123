"use client";

import { useActionState } from "react";
import { applyToJobAction, type ApplyState } from "@/app/jobs/[id]/actions";

const initialState: ApplyState = {};

type ApplyJobFormProps = {
  jobId: string;
};

export function ApplyJobForm({ jobId }: ApplyJobFormProps) {
  const applyWithJobId = applyToJobAction.bind(null, jobId);
  const [state, formAction, pending] = useActionState(applyWithJobId, initialState);

  return (
    <form action={formAction} className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Apply for this role</h2>
      <p className="mt-1 text-sm text-slate-600">Send your application with an optional cover letter.</p>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Cover letter (optional)
        <textarea
          name="cover_letter"
          rows={6}
          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
          placeholder="Share why you are a good fit for this role."
        />
      </label>

      {state.error ? <p className="mt-3 text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm text-emerald-700">{state.success}</p> : null}

      <button
        disabled={pending}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
