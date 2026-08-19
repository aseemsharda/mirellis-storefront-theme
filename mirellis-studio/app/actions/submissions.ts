"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudioRole } from "@/lib/auth";
import { parseSubmission, type ActionState } from "@/lib/validation";

export async function createSubmission(_: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireStudioRole(["contributor"]);
  const parsed = parseSubmission(formData);
  if (!parsed.success) return parsed.error;

  const { data, error } = await supabase.rpc("create_studio_submission", { payload: parsed.data });
  if (error || !data) return { ok: false, message: "The draft was not saved. Your text remains on this screen; try again." };
  redirect(`/workspace/submissions/${data}?notice=created`);
}

export async function updateSubmission(
  submissionId: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireStudioRole(["contributor"]);
  const parsed = parseSubmission(formData);
  if (!parsed.success) return parsed.error;

  const { error } = await supabase.rpc("update_studio_submission", {
    target_submission_id: submissionId,
    payload: parsed.data,
  });
  if (error) return { ok: false, message: "The changes were not saved. Check that this draft is still editable." };
  revalidatePath(`/workspace/submissions/${submissionId}`);
  return { ok: true, message: "Saved. Your private draft now includes these changes." };
}

export async function submitForReview(submissionId: string) {
  const { supabase } = await requireStudioRole(["contributor"]);
  const { data, error } = await supabase
    .from("studio_submissions")
    .update({ status: "submitted" })
    .eq("id", submissionId)
    .in("status", ["draft", "revision_requested"])
    .select("id,status")
    .maybeSingle();

  if (error || !data) redirect(`/workspace/submissions/${submissionId}?notice=submit-failed`);
  revalidatePath("/workspace");
  redirect(`/workspace/submissions/${submissionId}?notice=submitted`);
}

export async function withdrawSubmission(submissionId: string) {
  const { supabase } = await requireStudioRole(["contributor"]);
  const { data, error } = await supabase
    .from("studio_submissions")
    .update({ status: "withdrawn" })
    .eq("id", submissionId)
    .in("status", ["draft", "submitted", "revision_requested"])
    .select("id,status")
    .maybeSingle();

  if (error || !data) redirect(`/workspace/submissions/${submissionId}?notice=withdraw-failed`);
  revalidatePath("/workspace");
  redirect(`/workspace/submissions/${submissionId}?notice=withdrawn`);
}

export async function beginReview(submissionId: string) {
  const { supabase } = await requireStudioRole(["editor", "admin"]);
  const { data, error } = await supabase
    .from("studio_submissions")
    .update({ status: "in_review" })
    .eq("id", submissionId)
    .eq("status", "submitted")
    .select("id,status")
    .maybeSingle();

  if (error || !data) redirect(`/review/${submissionId}?notice=start-failed`);
  revalidatePath("/review");
  redirect(`/review/${submissionId}?notice=review-started`);
}

export async function savePrivateReview(
  submissionId: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId, supabase } = await requireStudioRole(["editor", "admin"]);
  const privateNotes = String(formData.get("private_notes") ?? "").trim();
  const checklist = {
    identity_scope: formData.get("identity_scope") === "on",
    claims_sources: formData.get("claims_sources") === "on",
    limitations: formData.get("limitations_check") === "on",
    safety_privacy: formData.get("safety_privacy") === "on",
    disclosures: formData.get("disclosures_check") === "on",
    copyright: formData.get("copyright_check") === "on",
  };
  if (privateNotes.length > 10000) return { ok: false, message: "Private notes must be under 10,000 characters." };

  const { error } = await supabase.from("editorial_reviews").upsert(
    {
      submission_id: submissionId,
      reviewer_id: userId,
      checklist,
      private_notes: privateNotes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "submission_id,reviewer_id" },
  );
  if (error) return { ok: false, message: "Private review notes were not saved." };
  revalidatePath(`/review/${submissionId}`);
  return { ok: true, message: "Saved privately. These notes are visible only to editors." };
}

export async function recordDecision(
  submissionId: string,
  _: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId, supabase } = await requireStudioRole(["editor", "admin"]);
  const decision = String(formData.get("decision") ?? "");
  const reason = String(formData.get("public_reason") ?? "").trim();
  const nextSteps = String(formData.get("next_steps") ?? "").trim();
  if (!["revision_requested", "hold", "accepted", "declined"].includes(decision)) {
    return { ok: false, message: "Choose an editorial decision." };
  }
  if (reason.length < 20 || nextSteps.length < 10) {
    return { ok: false, message: "Give the contributor a clear reason and explicit next step." };
  }

  const { error } = await supabase.from("editorial_decisions").insert({
    submission_id: submissionId,
    editor_id: userId,
    decision,
    public_reason: reason,
    next_steps: nextSteps,
  });
  if (error) return { ok: false, message: "The decision was not recorded. Confirm the item is still reviewable." };

  revalidatePath("/review");
  revalidatePath(`/review/${submissionId}`);
  revalidatePath(`/workspace/submissions/${submissionId}`);
  return { ok: true, message: `Decision recorded: ${decision.replace("_", " ")}. The contributor can see it now.` };
}
