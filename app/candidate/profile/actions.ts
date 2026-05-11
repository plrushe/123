"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildCvStoragePath, parseOptionalText, parseYearsExperience, validateCvFile } from "@/lib/candidate-profile";

const CV_BUCKET = "candidate-cvs";

export type CandidateProfileState = {
  error?: string;
  success?: string;
};

async function requireCandidate() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in first." as const };
  if (user.user_metadata?.role !== "candidate") return { error: "Only candidates can manage this page." as const };

  return { supabase, user };
}

export async function saveCandidateProfileAction(_: CandidateProfileState, formData: FormData): Promise<CandidateProfileState> {
  const auth = await requireCandidate();
  if ("error" in auth) return { error: auth.error };

  const yearsRaw = formData.get("years_experience");
  const years = parseYearsExperience(yearsRaw);
  if (typeof yearsRaw === "string" && yearsRaw.trim() !== "" && years === null) {
    return { error: "Years of experience must be a positive whole number." };
  }

  const payload = {
    id: auth.user.id,
    headline: parseOptionalText(formData.get("headline")),
    bio: parseOptionalText(formData.get("bio")),
    country_of_origin: parseOptionalText(formData.get("country_of_origin")),
    current_location: parseOptionalText(formData.get("current_location")),
    target_location: parseOptionalText(formData.get("target_location")),
    years_experience: years,
    tefl_status: parseOptionalText(formData.get("tefl_status")),
    degree_status: parseOptionalText(formData.get("degree_status")),
    visa_status: parseOptionalText(formData.get("visa_status")),
    availability: parseOptionalText(formData.get("availability")),
  };

  const { error } = await auth.supabase.from("candidate_profiles").upsert(payload);
  if (error) return { error: error.message };

  revalidatePath("/candidate/profile");
  return { success: "Profile saved successfully." };
}

export async function uploadCvAction(_: CandidateProfileState, formData: FormData): Promise<CandidateProfileState> {
  const auth = await requireCandidate();
  if ("error" in auth) return { error: auth.error };

  const file = formData.get("cv_file");
  if (!(file instanceof File)) return { error: "Please choose a file to upload." };

  const validationError = validateCvFile(file);
  if (validationError) return { error: validationError };

  const { data: existingCv } = await auth.supabase
    .from("cv_files")
    .select("id, file_path")
    .eq("candidate_id", auth.user.id)
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const path = buildCvStoragePath(auth.user.id, file.name);

  const { error: uploadError } = await auth.supabase.storage.from(CV_BUCKET).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (uploadError) return { error: uploadError.message };

  if (existingCv?.file_path) {
    await auth.supabase.storage.from(CV_BUCKET).remove([existingCv.file_path]);
    await auth.supabase.from("cv_files").delete().eq("id", existingCv.id);
  }

  const { error: metadataError } = await auth.supabase.from("cv_files").insert({
    candidate_id: auth.user.id,
    file_name: file.name,
    file_path: path,
    file_size: file.size,
    mime_type: file.type,
  });

  if (metadataError) return { error: metadataError.message };

  revalidatePath("/candidate/profile");
  return { success: "CV uploaded successfully." };
}
