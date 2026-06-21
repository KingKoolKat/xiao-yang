"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeNextPath(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "/";

  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(formData.get("next"));

  if (!email || !password) {
    redirect(`/login?error=missing&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
