"use client";

import { useActionState } from "react";
import type { AuthFormState } from "@/app/auth/actions";

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  includeRole?: boolean;
};

const INITIAL_STATE: AuthFormState = {};

export function AuthForm({ title, description, buttonLabel, action, includeRole = false }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-600">{description}</p>

      <form action={formAction} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input name="email" type="email" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
          <input name="password" type="password" minLength={6} required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>

        {includeRole ? (
          <>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">Full name (optional)</span>
              <input name="full_name" type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">I am signing up as</span>
              <select name="role" required defaultValue="candidate" className="w-full rounded-lg border border-slate-300 px-3 py-2">
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </label>
          </>
        ) : null}

        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

        <button disabled={pending} className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-70">
          {pending ? "Please wait..." : buttonLabel}
        </button>
      </form>
    </div>
  );
}
