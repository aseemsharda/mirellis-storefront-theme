"use server";

import { redirect } from "next/navigation";
import { studioConfig } from "@/lib/config";
import { createStudioServerClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/validation";

export async function requestSignInLink(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Enter the email address Mirellis invited.", field: "email" };
  }

  const config = studioConfig();
  if (!config.configured) {
    return { ok: false, message: "The private studio is not connected yet." };
  }

  const supabase = await createStudioServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${config.siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    return {
      ok: false,
      message: "We could not send a sign-in link. Check the invited address or try again in a minute.",
    };
  }

  redirect("/check-email");
}

export async function signOut() {
  const supabase = await createStudioServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
