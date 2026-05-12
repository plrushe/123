"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CompanyProfileState = {
  error?: string;
  success?: string;
};

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;

export async function saveCompanyProfileAction(_: CompanyProfileState, formData: FormData): Promise<CompanyProfileState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role !== "recruiter") {
    return { error: "Only recruiters can manage company profiles." };
  }

  const companyName = formData.get("company_name")?.toString().trim() ?? "";
  if (!companyName) return { error: "Company name is required." };

  const logoFile = formData.get("logo_file");
  let logoUrl: string | null = null;

  if (logoFile instanceof File && logoFile.size > 0) {
    if (!logoFile.type.startsWith("image/")) return { error: "Logo must be an image file." };
    if (logoFile.size > MAX_LOGO_SIZE_BYTES) return { error: "Logo must be 2MB or smaller." };

    const extension = logoFile.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${user.id}/logo.${extension}`;
    const { error: uploadError } = await supabase.storage.from("recruiter-logos").upload(filePath, logoFile, {
      upsert: true,
      contentType: logoFile.type,
    });

    if (uploadError) return { error: uploadError.message };
    logoUrl = supabase.storage.from("recruiter-logos").getPublicUrl(filePath).data.publicUrl;
  }

  const payload = {
    recruiter_id: user.id,
    company_name: companyName,
    company_tagline: formData.get("company_tagline")?.toString().trim() || null,
    logo_url: logoUrl,
  };

  const { error } = await supabase.from("recruiter_company_profiles").upsert(payload, { onConflict: "recruiter_id" });
  if (error) return { error: error.message };

  revalidatePath("/recruiter/company");
  revalidatePath("/jobs");
  return { success: "Company profile saved." };
}
