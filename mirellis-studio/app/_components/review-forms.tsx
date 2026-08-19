"use client";

import { useActionState } from "react";
import { recordDecision, savePrivateReview } from "@/app/actions/submissions";
import type { ActionState } from "@/lib/validation";

const initialState: ActionState = { ok: false, message: "" };

export function PrivateReviewForm({
  submissionId,
  review,
}: {
  submissionId: string;
  review?: { checklist: Record<string, boolean>; private_notes: string } | null;
}) {
  const [state, action, pending] = useActionState(savePrivateReview.bind(null, submissionId), initialState);
  const checks = [
    ["identity_scope", "Identity, contribution role, format and scope are clear."],
    ["claims_sources", "Every material claim is mapped to a verified source."],
    ["limitations_check", "Population, design and material limitations remain visible."],
    ["safety_privacy", "Safety, privacy and treatment-language boundaries are respected."],
    ["disclosures_check", "Funding, interests and AI assistance are adequately disclosed."],
    ["copyright_check", "Copyright, quotation and permissions are acceptable."],
  ];

  return (
    <form action={action} className="review-form">
      <fieldset className="review-checklist">
        <legend>Private editorial checklist</legend>
        {checks.map(([name, label]) => (
          <label className="check-row" key={name}>
            <input type="checkbox" name={name} defaultChecked={Boolean(review?.checklist?.[name])} />
            <span>{label}</span>
          </label>
        ))}
      </fieldset>
      <label htmlFor="private_notes">Private editor notes</label>
      <p className="field-help">Contributors cannot read this field. Do not put contributor-facing instructions here.</p>
      <textarea id="private_notes" name="private_notes" defaultValue={review?.private_notes} maxLength={10000} />
      <button className="button button-secondary" type="submit" disabled={pending}>{pending ? "Saving…" : "Save private review"}</button>
      <p className={`form-status ${state.ok ? "status-success" : ""}`} aria-live="polite">{state.message}</p>
    </form>
  );
}

export function DecisionForm({ submissionId }: { submissionId: string }) {
  const [state, action, pending] = useActionState(recordDecision.bind(null, submissionId), initialState);
  return (
    <form action={action} className="review-form decision-form">
      <label htmlFor="decision">Decision</label>
      <select id="decision" name="decision" required defaultValue="">
        <option value="" disabled>Choose one</option>
        <option value="revision_requested">Invite revision</option>
        <option value="hold">Hold while a question is resolved</option>
        <option value="accepted">Accept for a separate publication check</option>
        <option value="declined">Decline</option>
      </select>
      <label htmlFor="public_reason">Reason visible to the contributor</label>
      <textarea id="public_reason" name="public_reason" minLength={20} maxLength={3000} required />
      <label htmlFor="next_steps">Explicit next step</label>
      <textarea id="next_steps" name="next_steps" minLength={10} maxLength={3000} required />
      <p className="notice"><strong>Acceptance is not publication.</strong> This action never changes the public Mirellis website.</p>
      <button className="button button-primary" type="submit" disabled={pending}>{pending ? "Recording…" : "Record decision"}</button>
      <p className={`form-status ${state.ok ? "status-success" : ""}`} aria-live="polite">{state.message}</p>
    </form>
  );
}
