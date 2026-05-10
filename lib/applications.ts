export const APPLICATION_STATUSES = ["submitted", "reviewing", "shortlisted", "rejected"] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Application = {
  id: string;
  job_id: string;
  candidate_id: string;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
};

export function cleanCoverLetter(value: FormDataEntryValue | null) {
  const cleaned = value?.toString().trim() ?? "";
  return cleaned || null;
}
