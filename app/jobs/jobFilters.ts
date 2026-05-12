import type { Job } from "@/lib/jobs";

export type PublicJob = Pick<
  Job,
  | "id"
  | "title"
  | "company_name"
  | "location"
  | "salary"
  | "employment_type"
  | "visa_support"
  | "housing_provided"
  | "tefl_required"
  | "created_at"
>;

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
] as const;

export type JobFilterState = {
  keyword: string;
  location: string;
  employment_type: string;
  visa_support: boolean;
  housing_provided: boolean;
  tefl_required: boolean;
};

export const DEFAULT_JOB_FILTERS: JobFilterState = {
  keyword: "",
  location: "",
  employment_type: "",
  visa_support: false,
  housing_provided: false,
  tefl_required: false,
};

export function hasActiveFilters(filters: JobFilterState) {
  return Boolean(
    filters.keyword.trim() ||
      filters.location.trim() ||
      filters.employment_type ||
      filters.visa_support ||
      filters.housing_provided ||
      filters.tefl_required,
  );
}
