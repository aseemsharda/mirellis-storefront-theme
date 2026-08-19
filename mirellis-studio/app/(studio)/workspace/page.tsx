import Link from "next/link";
import { requireStudioIdentity } from "@/lib/auth";
import { formatDate, formatLabel, type Submission } from "@/lib/editorial";
import { StatusPill } from "@/app/_components/status-pill";

export default async function WorkspacePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { profile, supabase } = await requireStudioIdentity();
  const { data } = await supabase
    .from("studio_submissions")
    .select("*")
    .order("updated_at", { ascending: false });
  const submissions = (data ?? []) as Submission[];
  const { notice } = await searchParams;

  return (
    <main className="workspace-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your private work</p>
          <h1>{profile.role === "contributor" ? "Prepare a careful contribution." : "Editorial overview."}</h1>
          <p>
            Drafts are private. Submitting starts editorial review; it does not guarantee acceptance or publication.
          </p>
        </div>
        {profile.role === "contributor" && <Link className="button button-primary" href="/workspace/new">Start a contribution</Link>}
      </div>

      {notice === "not-authorized" && <p className="notice" role="status">That action is not available for your studio role.</p>}

      <section aria-labelledby="submissions-heading" className="workspace-section">
        <div className="section-heading">
          <h2 id="submissions-heading">Submissions</h2>
          <span>{submissions.length}</span>
        </div>
        {submissions.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing here yet.</h3>
            <p>Begin with one bounded idea, its evidence and the limits of what can be concluded.</p>
            {profile.role === "contributor" && <Link className="text-link" href="/workspace/new">Start a private draft</Link>}
          </div>
        ) : (
          <div className="submission-list">
            {submissions.map((submission) => (
              <Link className="submission-row" href={`/workspace/submissions/${submission.id}`} key={submission.id}>
                <div>
                  <span className="row-kicker">{formatLabel[submission.format]} · Revision {submission.revision}</span>
                  <h3>{submission.title}</h3>
                </div>
                <div className="row-meta">
                  <StatusPill status={submission.status} />
                  <span>Updated {formatDate(submission.updated_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
