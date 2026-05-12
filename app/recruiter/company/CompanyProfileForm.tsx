"use client";

import { useActionState } from "react";
import { saveCompanyProfileAction, type CompanyProfileState } from "./actions";

const initialState: CompanyProfileState = {};

export function CompanyProfileForm({
  initialCompanyName,
  initialTagline,
  initialLogoUrl,
}: {
  initialCompanyName: string;
  initialTagline: string;
  initialLogoUrl: string;
}) {
  const [state, formAction, pending] = useActionState(saveCompanyProfileAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" encType="multipart/form-data">
      <h2 className="text-xl font-semibold text-slate-900">Company profile</h2>
      <label className="block text-sm font-medium text-slate-700">Company name
        <input name="company_name" required defaultValue={initialCompanyName} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">Tagline
        <input name="company_tagline" defaultValue={initialTagline} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium text-slate-700">Logo image
        <input name="logo_file" type="file" accept="image/*" className="mt-1 block w-full text-sm" />
      </label>
      {initialLogoUrl ? <img src={initialLogoUrl} alt="Current company logo" className="h-14 w-14 rounded-xl border border-slate-200 object-contain p-1" /> : null}
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
      <button disabled={pending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Saving..." : "Save profile"}</button>
    </form>
  );
}
