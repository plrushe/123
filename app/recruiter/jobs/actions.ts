"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseNewJob } from "@/lib/jobs";

export type CreateJobState = {
  error?: string;
  success?: string;
};

export async function createJobAction(_: CreateJobState, formData: FormData): Promise<CreateJobState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Please log in to create a job." };
  if (user.user_metadata?.role !== "recruiter") return { error: "Only recruiters can create jobs." };

  const parsed = parseNewJob(formData);
  if (parsed.error || !parsed.data) return { error: parsed.error };

  const { error } = await supabase.from("jobs").insert({
    ...parsed.data,
    recruiter_id: user.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/recruiter/jobs");
  revalidatePath("/jobs");
  return { success: "Job saved successfully." };
}
