import type { Job } from "@/lib/jobs";

export type PublicJob = Pick<
  Job,
  | "id"
  | "recruiter_id"
  | "title"
  | "company_name"
  | "location"
  | "salary"
  | "employment_type"
  | "visa_support"
  | "housing_provided"
  | "tefl_required"
  | "created_at"
> & {
  company_tagline?: string | null;
  logo_url?: string | null;
};

export const COUNTRY_OPTIONS = ["South Korea", "China", "Japan", "United Arab Emirates", "Costa Rica", "International"] as const;
// ... unchanged
export const CITY_OPTIONS: Record<string, string[]> = {
  "South Korea": ["Seoul", "Busan", "Incheon", "Daegu"],
  China: ["Beijing", "Shanghai", "Shenzhen", "Guangzhou"],
  Japan: ["Tokyo", "Osaka", "Nagoya", "Fukuoka"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  "Costa Rica": ["San José", "Alajuela", "Heredia"],
};

export const SCHOOL_TYPE_OPTIONS = ["Kindergarten", "Primary School", "Middle School", "High School", "College", "University"] as const;
export const JOB_TYPE_OPTIONS = ["Full time", "Part time", "Online", "Hybrid"] as const;
export const DATE_POSTED_OPTIONS = [3, 7, 14, 30] as const;

export type JobFilterState = {
  keyword: string;
  country: string;
  city: string;
  school_type: string;
  job_type: string;
  posted_within_days: string;
  housing_provided: boolean;
  verified_recruiter: boolean;
  tefl_required: boolean;
  pgce_required: boolean;
};

export const DEFAULT_JOB_FILTERS: JobFilterState = {
  keyword: "",
  country: "",
  city: "",
  school_type: "",
  job_type: "",
  posted_within_days: "",
  housing_provided: false,
  verified_recruiter: false,
  tefl_required: false,
  pgce_required: false,
};

export function hasActiveFilters(filters: JobFilterState) {
  return Object.entries(filters).some(([key, value]) => (typeof value === "boolean" ? value : key !== "keyword" ? Boolean(value.trim()) : Boolean(value.trim())));
}
