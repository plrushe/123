export type CandidateProfile = {
  id: string;
  headline: string | null;
  bio: string | null;
  country_of_origin: string | null;
  current_location: string | null;
  target_location: string | null;
  years_experience: number | null;
  tefl_status: string | null;
  degree_status: string | null;
  visa_status: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
};

export type CvFile = {
  id: string;
  candidate_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
};

const MAX_CV_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
] as const;

export function parseOptionalText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function parseYearsExperience(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
}

export function validateCvFile(file: File) {
  if (!file || file.size === 0) return "Please choose a CV file.";
  if (file.size > MAX_CV_FILE_SIZE_BYTES) return "CV must be smaller than 5MB.";
  if (!ALLOWED_CV_MIME_TYPES.includes(file.type as (typeof ALLOWED_CV_MIME_TYPES)[number])) {
    return "Only PDF, DOC, or DOCX files are allowed.";
  }
  return null;
}

export function buildCvStoragePath(candidateId: string, originalFilename: string) {
  const safeFileName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${candidateId}/${Date.now()}-${safeFileName}`;
}
