import { redirect } from "next/navigation";
import { createStudioServerClient } from "@/lib/supabase/server";
import type { StudioProfile, StudioRole } from "@/lib/editorial";

export async function getStudioIdentity() {
  const supabase = await createStudioServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return null;

  const { data: profile, error } = await supabase
    .from("studio_profiles")
    .select("user_id, display_name, role")
    .eq("user_id", userId)
    .maybeSingle<StudioProfile>();

  if (error) throw new Error("Unable to verify studio access.");
  return profile ? { userId, profile, supabase } : { userId, profile: null, supabase };
}

export async function requireStudioIdentity() {
  const identity = await getStudioIdentity();
  if (!identity) redirect("/?reason=signin");
  if (!identity.profile) redirect("/access-pending");
  return { ...identity, profile: identity.profile };
}

export async function requireStudioRole(roles: StudioRole[]) {
  const identity = await requireStudioIdentity();
  if (!roles.includes(identity.profile.role)) redirect("/workspace?notice=not-authorized");
  return identity;
}
