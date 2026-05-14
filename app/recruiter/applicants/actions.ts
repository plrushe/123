"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/applications";

export async function updateApplicationStatusAction(formData: FormData) {
  const applicationId = formData.get("application_id")?.toString();
  const nextStatus = formData.get("status")?.toString() as ApplicationStatus;
  if (!applicationId || !nextStatus) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("applications").update({ status: nextStatus }).eq("id", applicationId);
  revalidatePath("/recruiter");
  revalidatePath("/recruiter/applicants");
}
