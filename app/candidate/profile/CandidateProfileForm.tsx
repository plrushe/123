"use client";

import { useActionState } from "react";
import { saveCandidateProfileAction, uploadCvAction, type CandidateProfileState } from "@/app/candidate/profile/actions";
import type { CandidateProfile, CvFile } from "@/lib/candidate-profile";

const initialState: CandidateProfileState = {};

type CandidateProfileFormProps = {
  profile: CandidateProfile | null;
  cvFile: CvFile | null;
};

export function CandidateProfileForm({ profile, cvFile }: CandidateProfileFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(saveCandidateProfileAction, initialState);
  const [cvState, cvAction, cvPending] = useActionState(uploadCvAction, initialState);

  return (
    <div className="mt-8 grid gap-6">
      <form action={profileAction} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Your profile</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Headline<input name="headline" defaultValue={profile?.headline ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">Years of experience<input name="years_experience" type="number" min={0} defaultValue={profile?.years_experience ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">Country of origin<input name="country_of_origin" defaultValue={profile?.country_of_origin ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">Current location<input name="current_location" defaultValue={profile?.current_location ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">Target location<input name="target_location" defaultValue={profile?.target_location ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">Availability<input name="availability" defaultValue={profile?.availability ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">TEFL status<input name="tefl_status" defaultValue={profile?.tefl_status ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700">Degree status<input name="degree_status" defaultValue={profile?.degree_status ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">Visa status<input name="visa_status" defaultValue={profile?.visa_status ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        </div>
        <label className="block text-sm font-medium text-slate-700">Bio
          <textarea name="bio" rows={5} defaultValue={profile?.bio ?? ""} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </label>
        {profileState.error ? <p className="text-sm text-red-600">{profileState.error}</p> : null}
        {profileState.success ? <p className="text-sm text-emerald-700">{profileState.success}</p> : null}
        <button disabled={profilePending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
          {profilePending ? "Saving..." : "Save profile"}
        </button>
      </form>

      <form action={cvAction} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">CV upload</h2>
        {cvFile ? (
          <p className="text-sm text-slate-700">
            Current file: <span className="font-medium">{cvFile.file_name}</span> (uploaded {new Date(cvFile.uploaded_at).toLocaleDateString()})
          </p>
        ) : (
          <p className="text-sm text-slate-600">No CV uploaded yet.</p>
        )}
        <label className="block text-sm font-medium text-slate-700">Upload PDF, DOC, or DOCX (max 5MB)
          <input name="cv_file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="mt-1 block w-full text-sm" required />
        </label>
        {cvState.error ? <p className="text-sm text-red-600">{cvState.error}</p> : null}
        {cvState.success ? <p className="text-sm text-emerald-700">{cvState.success}</p> : null}
        <button disabled={cvPending} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
          {cvPending ? "Uploading..." : cvFile ? "Replace CV" : "Upload CV"}
        </button>
      </form>
    </div>
  );
}
