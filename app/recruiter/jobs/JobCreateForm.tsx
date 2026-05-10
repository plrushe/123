"use client";

import { useActionState } from "react";
import { createJobAction, type CreateJobState } from "@/app/recruiter/jobs/actions";

const initialState: CreateJobState = {};

export function JobCreateForm() {
  const [state, formAction, pending] = useActionState(createJobAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Create a new job</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Title<input name="title" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-slate-700">Company name<input name="company_name" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-slate-700">Location<input name="location" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-slate-700">Salary<input name="salary" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-slate-700">Employment type<input name="employment_type" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <label className="text-sm font-medium text-slate-700">Status
          <select name="status" defaultValue="published" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">Description
        <textarea name="description" required rows={5} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">Requirements
        <textarea name="requirements" rows={4} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <div className="flex flex-wrap gap-4 text-sm text-slate-700">
        <label className="flex items-center gap-2"><input type="checkbox" name="visa_support" /> Visa support</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="housing_provided" /> Housing provided</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="tefl_required" /> TEFL required</label>
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
      <button disabled={pending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
        {pending ? "Saving..." : "Save job"}
      </button>
    </form>
  );
}
