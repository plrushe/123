"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
};

const ALLOWED_ROLES = ["candidate", "recruiter"] as const;

type AllowedRole = (typeof ALLOWED_ROLES)[number];

export async function signUpAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const fullName = formData.get("full_name")?.toString().trim() ?? "";
  const role = formData.get("role")?.toString() as AllowedRole;

  if (!email || !password || !ALLOWED_ROLES.includes(role)) {
    return { error: "Please complete all required fields." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        full_name: fullName || null,
      },
    },
  });

  if (error) return { error: error.message };

  redirect(role === "recruiter" ? "/recruiter" : "/candidate");
}

export async function signInAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role;

  redirect(role === "recruiter" ? "/recruiter" : "/candidate");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
