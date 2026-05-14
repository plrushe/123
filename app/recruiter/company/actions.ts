"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveCompanyProfileAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const payload = {
    recruiter_id: user.id,
    company_name: formData.get("company_name")?.toString() ?? "",
    location: formData.get("location")?.toString() ?? "",
    logo_url: formData.get("logo_url")?.toString() ?? "",
    description: formData.get("description")?.toString() ?? "",
    contact_email: formData.get("contact_email")?.toString() ?? "",
    contact_phone: formData.get("contact_phone")?.toString() ?? "",
    website: formData.get("website")?.toString() ?? "",
  };
  await supabase.from("recruiter_company_profiles").upsert(payload, { onConflict: "recruiter_id" });
  revalidatePath("/recruiter/company");
}
