"use server";

import { redirect } from "next/navigation";

import { safeNextPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}

export async function signOutToLogin(nextPath?: string, emailHint?: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  const next = safeNextPath(nextPath);
  const params = new URLSearchParams({ next });
  if (emailHint) {
    params.set("email", emailHint);
  }

  redirect(`/login?${params.toString()}`);
}
