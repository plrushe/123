import type { SupabaseClient } from "@supabase/supabase-js";

export type RecruiterCandidateFilters = {
  q: string;
  targetLocation: string;
  teflStatus: string;
  degreeStatus: string;
  visaStatus: string;
};

export type RecruiterCandidateCard = {
  id: string;
  headline: string | null;
  current_location: string | null;
  target_location: string | null;
  years_experience: number | null;
  tefl_status: string | null;
  availability: string | null;
  profiles: {
    full_name: string | null;
  } | null;
};

export function parseRecruiterCandidateFilters(searchParams: Record<string, string | string[] | undefined>): RecruiterCandidateFilters {
  const getValue = (key: string) => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value[0]?.trim() ?? "";
    return value?.trim() ?? "";
  };

  return {
    q: getValue("q"),
    targetLocation: getValue("targetLocation"),
    teflStatus: getValue("teflStatus"),
    degreeStatus: getValue("degreeStatus"),
    visaStatus: getValue("visaStatus"),
  };
}

export async function fetchRecruiterCandidates(supabase: SupabaseClient, filters: RecruiterCandidateFilters) {
  let query = supabase
    .from("candidate_profiles")
    .select("id, headline, current_location, target_location, years_experience, tefl_status, availability, profiles!inner(full_name)")
    .order("updated_at", { ascending: false });

  if (filters.q) query = query.or(`headline.ilike.%${filters.q}%,profiles.full_name.ilike.%${filters.q}%`);
  if (filters.targetLocation) query = query.ilike("target_location", `%${filters.targetLocation}%`);
  if (filters.teflStatus) query = query.eq("tefl_status", filters.teflStatus);
  if (filters.degreeStatus) query = query.eq("degree_status", filters.degreeStatus);
  if (filters.visaStatus) query = query.eq("visa_status", filters.visaStatus);

  const { data, error } = await query;
  if (error) return { data: [] as RecruiterCandidateCard[], error: error.message };

  return { data: (data ?? []) as RecruiterCandidateCard[], error: null };
}
