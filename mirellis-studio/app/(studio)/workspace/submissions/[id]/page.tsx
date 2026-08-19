import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmAction } from "@/app/_components/confirm-action";
import { StatusPill } from "@/app/_components/status-pill";
import { SubmissionForm } from "@/app/_components/submission-form";
import { submitForReview, withdrawSubmission } from "@/app/actions/submissions";
import { requireStudioIdentity } from "@/lib/auth";
import {
  canContributorEdit,
  formatDate,
  formatLabel,
  isEditor,
  territoryLabel,
  type EditorialDecision,
  type Submission,
  type SubmissionDisclosure,
  type SubmissionSource,
} from "@/lib/editorial";

type AuditEvent = { id: number; event_type: string; from_status: string | null; to_status: string | null; created_at: string };

export default async function SubmissionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  const { notice } = await searchParams;
  const { profile, supabase } = await requireStudioIdentity();
  const [submissionResult, sourcesResult, disclosureResult, decisionsResult, auditResult] = await Promise.all([
    supabase.from("studio_submissions").select("*").eq("id", id).maybeSingle(),
    supabase.from("studio_sources").select("*").eq("submission_id", id).order("position"),
    supabase.from("studio_disclosures").select("*").eq("submission_id", id).maybeSingle(),
    supabase.from("editorial_decisions").select("id,submission_id,decision,public_reason,next_steps,created_at").eq("submission_id", id).order("created_at", { ascending: false }),
    supabase.from("studio_audit_events").select("id,event_type,from_status,to_status,created_at").eq("submission_id", id).order("created_at", { ascending: false }),
  ]);
  if (!submissionResult.data) notFound();

  const submission = submissionResult.data as Submission;
  const sources = (sourcesResult.data ?? []) as SubmissionSource[];
  const disclosure = disclosureResult.data as SubmissionDisclosure | null;
  const decisions = (decisionsResult.data ?? []) as EditorialDecision[];
  const audit = (auditResult.data ?? []) as AuditEvent[];
  const editable = profile.role === "contributor" && canContributorEdit(submission.status);
  const noticeCopy: Record<string, string> = {
    created: "Draft created. It is private and has not been submitted.",
    submitted: "Submitted for editorial review. Mirellis will record any decision here.",
    "submit-failed": "The submission did not enter review. Check its current state and try again.",
    withdrawn: "Withdrawn. The record remains private and preserved in the audit trail.",
    "withdraw-failed": "The item could not be withdrawn from its current state.",
  };

  return (
    <main className="workspace-main form-page">
      <Link className="back-link" href="/workspace">← Back to workspace</Link>
      <div className="record-heading">
        <div>
          <p className="eyebrow">{formatLabel[submission.format]} · {territoryLabel[submission.territory]} · Revision {submission.revision}</p>
          <h1>{submission.title}</h1>
          <p>Created {formatDate(submission.created_at)} · Updated {formatDate(submission.updated_at)}</p>
        </div>
        <StatusPill status={submission.status} />
      </div>

      {notice && noticeCopy[notice] && <p className="notice" role="status">{noticeCopy[notice]}</p>}
      {submission.status === "accepted" && (
        <p className="notice"><strong>Accepted does not mean published.</strong> A separate human publication check and public record assignment are still required.</p>
      )}

      {editable ? (
        <SubmissionForm submission={submission} sources={sources} disclosure={disclosure} />
      ) : (
        <ReadOnlySubmission submission={submission} sources={sources} disclosure={disclosure} />
      )}

      <section className="record-actions" aria-labelledby="actions-heading">
        <div><p className="eyebrow">Current decision point</p><h2 id="actions-heading">What happens next</h2></div>
        <div className="action-row">
          {profile.role === "contributor" && canContributorEdit(submission.status) && (
            <form action={submitForReview.bind(null, submission.id)}>
              <ConfirmAction className="button button-primary" label={submission.status === "revision_requested" ? "Resubmit for editorial review" : "Submit for editorial review"} prompt="Submit this saved version for editorial review? You will not be able to edit it unless an editor requests revision." />
            </form>
          )}
          {profile.role === "contributor" && ["draft", "submitted", "revision_requested"].includes(submission.status) && (
            <form action={withdrawSubmission.bind(null, submission.id)}>
              <ConfirmAction className="button button-danger" label="Withdraw submission" prompt="Withdraw this submission? It will remain private and preserved in the audit trail." />
            </form>
          )}
          {isEditor(profile.role) && <Link className="button button-primary" href={`/review/${submission.id}`}>Open editorial review</Link>}
        </div>
      </section>

      <section className="timeline-section" aria-labelledby="decisions-heading">
        <h2 id="decisions-heading">Editorial decisions</h2>
        {decisions.length === 0 ? <p className="quiet-copy">No editorial decision has been recorded.</p> : decisions.map((decision) => (
          <article className="decision-card" key={decision.id}>
            <div><strong>{decision.decision.replace("_", " ")}</strong><span>{formatDate(decision.created_at)}</span></div>
            <p>{decision.public_reason}</p>
            <p><strong>Next step:</strong> {decision.next_steps}</p>
          </article>
        ))}
      </section>

      <details className="audit-details">
        <summary>View submission history</summary>
        <ol>
          {audit.map((event) => <li key={event.id}><span>{event.event_type.replaceAll("_", " ")}</span><span>{event.from_status ? `${event.from_status} → ` : ""}{event.to_status}</span><time>{formatDate(event.created_at)}</time></li>)}
        </ol>
      </details>
    </main>
  );
}

function ReadOnlySubmission({ submission, sources, disclosure }: { submission: Submission; sources: SubmissionSource[]; disclosure: SubmissionDisclosure | null }) {
  return (
    <div className="readonly-record">
      <RecordBlock title="Bounded statement"><p>{submission.bounded_statement}</p></RecordBlock>
      <RecordBlock title="Contribution"><p className="preserve-lines">{submission.contribution_text}</p></RecordBlock>
      <div className="record-columns">
        <RecordBlock title="Evidence basis"><p>{submission.evidence_basis}</p></RecordBlock>
        <RecordBlock title="Limitations"><p>{submission.limitations}</p></RecordBlock>
      </div>
      <RecordBlock title="Sources">
        {sources.map((source) => <article className="source-summary" key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.citation}</a><p><strong>Supports:</strong> {source.supports}</p><p><strong>Does not support:</strong> {source.does_not_support}</p></article>)}
      </RecordBlock>
      <div className="record-columns">
        <RecordBlock title="Contributor credit"><p>{submission.contributor_credit}</p><p>{submission.contribution_roles.join(", ")}</p></RecordBlock>
        <RecordBlock title="Disclosures"><p><strong>Funding:</strong> {disclosure?.funding}</p><p><strong>Interests:</strong> {disclosure?.interests}</p><p><strong>AI assistance:</strong> {disclosure?.ai_assistance}</p></RecordBlock>
      </div>
    </div>
  );
}

function RecordBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="record-block"><h2>{title}</h2>{children}</section>;
}
