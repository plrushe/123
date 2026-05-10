export const JOB_STATUSES = ["draft", "published", "closed"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export type Job = {
  id: string;
  recruiter_id: string;
  title: string;
  company_name: string;
  location: string;
  salary: string | null;
  description: string;
  requirements: string | null;
  employment_type: string | null;
  visa_support: boolean;
  housing_provided: boolean;
  tefl_required: boolean;
  status: JobStatus;
  created_at: string;
  updated_at: string;
};

export type NewJobInput = {
  title: string;
  company_name: string;
  location: string;
  salary?: string;
  description: string;
  requirements?: string;
  employment_type?: string;
  visa_support: boolean;
  housing_provided: boolean;
  tefl_required: boolean;
  status: JobStatus;
};

export function parseCheckbox(value: FormDataEntryValue | null) {
  return value === "on";
}

export function cleanOptionalText(value: FormDataEntryValue | null) {
  const cleaned = value?.toString().trim() ?? "";
  return cleaned || null;
}

export function parseNewJob(formData: FormData): { data?: NewJobInput; error?: string } {
  const title = formData.get("title")?.toString().trim() ?? "";
  const company_name = formData.get("company_name")?.toString().trim() ?? "";
  const location = formData.get("location")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const status = formData.get("status")?.toString() as JobStatus;

  if (!title || !company_name || !location || !description) {
    return { error: "Please fill in all required fields." };
  }

  if (!JOB_STATUSES.includes(status)) {
    return { error: "Please choose a valid job status." };
  }

  return {
    data: {
      title,
      company_name,
      location,
      salary: cleanOptionalText(formData.get("salary")) ?? undefined,
      description,
      requirements: cleanOptionalText(formData.get("requirements")) ?? undefined,
      employment_type: cleanOptionalText(formData.get("employment_type")) ?? undefined,
      visa_support: parseCheckbox(formData.get("visa_support")),
      housing_provided: parseCheckbox(formData.get("housing_provided")),
      tefl_required: parseCheckbox(formData.get("tefl_required")),
      status,
    },
  };
}
