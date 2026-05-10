"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cleanCoverLetter } from "@/lib/applications";

export type ApplyState = {
  error?: string;
  success?: string;
};

export async function applyToJobAction(jobId: string, _: ApplyState, formData: FormData): Promise<ApplyState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in to apply." };
  if (user.user_metadata?.role !== "candidate") return { error: "Only candidates can apply." };

  const { data: job } = await supabase
    .from("jobs")
    .select("id, status")
    .eq("id", jobId)
    .eq("status", "published")
    .maybeSingle();

  if (!job) return { error: "This job is not available for applications." };

  const coverLetter = cleanCoverLetter(formData.get("cover_letter"));

  const { error } = await supabase.from("applications").insert({
    job_id: jobId,
    candidate_id: user.id,
    cover_letter: coverLetter,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You already applied to this job." };
    }
    return { error: error.message };
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/candidate/applications");
  revalidatePath("/recruiter/applicants");

  return { success: "Application submitted successfully." };
}
