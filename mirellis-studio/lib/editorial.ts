export type StudioRole = "contributor" | "editor" | "admin";
export type SubmissionFormat = "evidence_note" | "expert_commentary";
export type StudioTerritory = "sleep" | "focus" | "restoration" | "human_state_transition";
export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "revision_requested"
  | "hold"
  | "accepted"
  | "declined"
  | "withdrawn";

export type StudioProfile = {
  user_id: string;
  display_name: string;
  role: StudioRole;
};

export type Submission = {
  id: string;
  owner_id: string;
  format: SubmissionFormat;
  territory: StudioTerritory;
  title: string;
  bounded_statement: string;
  contribution_text: string;
  evidence_basis: string;
  limitations: string;
  contributor_credit: string;
  contribution_roles: string[];
  status: SubmissionStatus;
  revision: number;
  submitted_at: string | null;
  decided_at: string | null;
  withdrawn_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SubmissionSource = {
  id: string;
  submission_id: string;
  citation: string;
  url: string;
  supports: string;
  does_not_support: string;
  position: number;
};

export type SubmissionDisclosure = {
  submission_id: string;
  funding: string;
  interests: string;
  ai_assistance: string;
  confidential_ai_permission: boolean;
  human_accountability_confirmed: boolean;
};

export type EditorialDecision = {
  id: string;
  submission_id: string;
  decision: "revision_requested" | "hold" | "accepted" | "declined";
  public_reason: string;
  next_steps: string;
  created_at: string;
};

export const formatLabel: Record<SubmissionFormat, string> = {
  evidence_note: "Evidence Note",
  expert_commentary: "Expert Commentary",
};

export const territoryLabel: Record<StudioTerritory, string> = {
  sleep: "Sleep",
  focus: "Focus",
  restoration: "Restoration",
  human_state_transition: "Human State Transition",
};

export const statusLabel: Record<SubmissionStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  revision_requested: "Revision requested",
  hold: "On hold",
  accepted: "Accepted — not published",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

export function canContributorEdit(status: SubmissionStatus) {
  return status === "draft" || status === "revision_requested";
}

export function isEditor(role: StudioRole) {
  return role === "editor" || role === "admin";
}

export function validateTransition(role: StudioRole, from: SubmissionStatus, to: SubmissionStatus) {
  if (role === "contributor") {
    return (
      ((from === "draft" || from === "revision_requested") && to === "submitted") ||
      ((from === "draft" || from === "submitted" || from === "revision_requested") && to === "withdrawn")
    );
  }

  return (
    (from === "submitted" && to === "in_review") ||
    ((from === "submitted" || from === "in_review" || from === "hold") &&
      (to === "revision_requested" || to === "hold" || to === "accepted" || to === "declined"))
  );
}

export function formatDate(value: string | null) {
  if (!value) return "Not yet";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
