import Link from "next/link";
import { notFound } from "next/navigation";
import { beginReview } from "@/app/actions/submissions";
import { ConfirmAction } from "@/app/_components/confirm-action";
import { DecisionForm, PrivateReviewForm } from "@/app/_components/review-forms";
import { StatusPill } from "@/app/_components/status-pill";
import { requireStudioRole } from "@/lib/auth";
import { formatDate, formatLabel, territoryLabel, type Submission, type SubmissionDisclosure, type SubmissionSource } from "@/lib/editorial";

type Review = { checklist: Record<string, boolean>; private_notes: string };

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ notice?: string }>;
}) {
  const { id } = await params;
  const { notice } = await searchParams;
  const { userId, supabase } = await requireStudioRole(["editor", "admin"]);
  const [submissionResult, sourcesResult, disclosureResult, reviewResult] = await Promise.all([
    supabase.from("studio_submissions").select("*").eq("id", id).maybeSingle(),
    supabase.from("studio_sources").select("*").eq("submission_id", id).order("position"),
    supabase.from("studio_disclosures").select("*").eq("submission_id", id).maybeSingle(),
    supabase.from("editorial_reviews").select("checklist,private_notes").eq("submission_id", id).eq("reviewer_id", userId).maybeSingle(),
  ]);
  if (!submissionResult.data) notFound();
  const submission = submissionResult.data as Submission;
  const sources = (sourcesResult.data ?? []) as SubmissionSource[];
  const disclosure = disclosureResult.data as SubmissionDisclosure | null;
  const review = reviewResult.data as Review | null;
  const canDecide = ["submitted", "in_review", "hold"].includes(submission.status);

  return (
    <main className="workspace-main form-page">
      <Link className="back-link" href="/review">← Back to review queue</Link>
      <div className="record-heading">
        <div><p className="eyebrow">{formatLabel[submission.format]} · {territoryLabel[submission.territory]} · Revision {submission.revision}</p><h1>{submission.title}</h1><p>Submitted {formatDate(submission.submitted_at)}</p></div>
        <StatusPill status={submission.status} />
      </div>
      {notice === "review-started" && <p className="notice" role="status">Review started. The contributor can now see that this work is in review.</p>}
      {notice === "start-failed" && <p className="notice notice-error" role="alert">The review state did not change. Refresh and confirm the submission is still waiting.</p>}

      <section className="review-banner">
        <p><strong>Contributor text is read-only.</strong> Editors record judgment; they do not silently rewrite the contribution.</p>
        {submission.status === "submitted" && (
          <form action={beginReview.bind(null, submission.id)}>
            <ConfirmAction className="button button-primary" label="Begin editorial review" prompt="Mark this submission as in review? The contributor will see the change." />
          </form>
        )}
      </section>

      <div className="review-layout">
        <article className="review-document">
          <ReviewBlock title="Bounded statement"><p>{submission.bounded_statement}</p></ReviewBlock>
          <ReviewBlock title="Contribution"><p className="preserve-lines">{submission.contribution_text}</p></ReviewBlock>
          <ReviewBlock title="Evidence basis"><p>{submission.evidence_basis}</p></ReviewBlock>
          <ReviewBlock title="Limitations"><p>{submission.limitations}</p></ReviewBlock>
          <ReviewBlock title="Sources">{sources.map((source) => <div className="source-summary" key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.citation}</a><p><strong>Supports:</strong> {source.supports}</p><p><strong>Does not support:</strong> {source.does_not_support}</p></div>)}</ReviewBlock>
          <ReviewBlock title="Credit and disclosures"><p><strong>Credit:</strong> {submission.contributor_credit}</p><p><strong>Roles:</strong> {submission.contribution_roles.join(", ")}</p><p><strong>Funding:</strong> {disclosure?.funding}</p><p><strong>Interests:</strong> {disclosure?.interests}</p><p><strong>AI assistance:</strong> {disclosure?.ai_assistance}</p><p><strong>Confidential AI permission:</strong> {disclosure?.confidential_ai_permission ? "Explicitly granted" : "Not granted"}</p></ReviewBlock>
        </article>
        <aside className="review-sidebar" aria-label="Editorial controls">
          <section><p className="eyebrow">Editor only</p><h2>Review record</h2><PrivateReviewForm submissionId={submission.id} review={review} /></section>
          {canDecide ? <section><p className="eyebrow">Visible decision</p><h2>Decision</h2><DecisionForm submissionId={submission.id} /></section> : <p className="notice">This item is not currently open for a new decision.</p>}
        </aside>
      </div>
    </main>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="record-block"><h2>{title}</h2>{children}</section>;
}
