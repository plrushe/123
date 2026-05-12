import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PublicJob } from "@/app/jobs/jobFilters";

type CompanyProfile = { recruiter_id: string; logo_url: string | null; company_tagline: string | null };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const country = searchParams.get("country")?.trim() ?? "";
  const city = searchParams.get("city")?.trim() ?? "";
  const schoolType = searchParams.get("school_type")?.trim() ?? "";
  const jobType = searchParams.get("job_type")?.trim() ?? "";
  const postedWithinDays = Number(searchParams.get("posted_within_days") ?? "0");
  const housingProvided = searchParams.get("housing_provided") === "true";
  const teflRequired = searchParams.get("tefl_required") === "true";
  const pgceRequired = searchParams.get("pgce_required") === "true";

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("jobs")
    .select("id, recruiter_id, title, company_name, location, salary, employment_type, visa_support, housing_provided, tefl_required, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (keyword) query = query.or(`title.ilike.%${keyword}%,company_name.ilike.%${keyword}%,location.ilike.%${keyword}%`);
  if (country && country !== "International") query = query.ilike("location", `%${country}%`);
  if (city) query = query.ilike("location", `%${city}%`);
  if (jobType) query = query.ilike("employment_type", `%${jobType}%`);
  if (housingProvided) query = query.eq("housing_provided", true);
  if (teflRequired) query = query.eq("tefl_required", true);
  if (postedWithinDays > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - postedWithinDays);
    query = query.gte("created_at", cutoff.toISOString());
  }
  if (schoolType) query = query.or(`description.ilike.%${schoolType}%,requirements.ilike.%${schoolType}%`);
  if (pgceRequired) query = query.ilike("requirements", "%PGCE%");

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Unable to fetch jobs right now." }, { status: 500 });

  const recruiterIds = [...new Set((data ?? []).map((job) => job.recruiter_id))];
  const { data: profiles } = recruiterIds.length
    ? await supabase.from("recruiter_company_profiles").select("recruiter_id, logo_url, company_tagline").in("recruiter_id", recruiterIds)
    : { data: [] as CompanyProfile[] };

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.recruiter_id, profile]));
  const jobs = ((data ?? []) as PublicJob[]).map((job) => ({ ...job, ...profileMap.get(job.recruiter_id) }));

  return NextResponse.json({ jobs });
}
