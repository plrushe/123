import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EMPLOYMENT_TYPES, type PublicJob } from "@/app/jobs/jobFilters";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const location = searchParams.get("location")?.trim() ?? "";
  const employmentType = searchParams.get("employment_type")?.trim() ?? "";
  const visaSupport = searchParams.get("visa_support") === "true";
  const housingProvided = searchParams.get("housing_provided") === "true";
  const teflRequired = searchParams.get("tefl_required") === "true";

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("jobs")
    .select("id, title, company_name, location, salary, employment_type, visa_support, housing_provided, tefl_required, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (keyword) {
    const escapedKeyword = keyword.replace(/[,%]/g, "");
    query = query.or(
      `title.ilike.%${escapedKeyword}%,company_name.ilike.%${escapedKeyword}%,location.ilike.%${escapedKeyword}%`,
    );
  }

  if (location) {
    const escapedLocation = location.replace(/[,%]/g, "");
    query = query.ilike("location", `%${escapedLocation}%`);
  }

  if (employmentType && EMPLOYMENT_TYPES.includes(employmentType as (typeof EMPLOYMENT_TYPES)[number])) {
    query = query.eq("employment_type", employmentType);
  }

  if (visaSupport) query = query.eq("visa_support", true);
  if (housingProvided) query = query.eq("housing_provided", true);
  if (teflRequired) query = query.eq("tefl_required", true);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Unable to fetch jobs right now." }, { status: 500 });
  }

  return NextResponse.json({ jobs: (data ?? []) as PublicJob[] });
}
