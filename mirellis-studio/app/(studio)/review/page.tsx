import Link from "next/link";
import { requireStudioRole } from "@/lib/auth";
import { formatDate, formatLabel, territoryLabel, type Submission } from "@/lib/editorial";
import { StatusPill } from "@/app/_components/status-pill";

export default async function ReviewQueuePage() {
  const { supabase } = await requireStudioRole(["editor", "admin"]);
  const { data } = await supabase
    .from("studio_submissions")
    .select("*")
    .in("status", ["submitted", "in_review", "hold"])
    .order("submitted_at", { ascending: true });
  const queue = (data ?? []) as Submission[];

  return (
    <main className="workspace-main">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Editorial review</p>
          <h1>Make the decision inspectable.</h1>
          <p>The queue shows submitted work only. Private notes remain separate from contributor-visible decisions.</p>
        </div>
      </div>
      <section className="workspace-section" aria-labelledby="queue-heading">
        <div className="section-heading"><h2 id="queue-heading">Review queue</h2><span>{queue.length}</span></div>
        {queue.length === 0 ? (
          <div className="empty-state"><h3>The queue is clear.</h3><p>No submitted contribution currently needs an editorial decision.</p></div>
        ) : (
          <div className="submission-list">
            {queue.map((submission) => (
              <Link className="submission-row" href={`/review/${submission.id}`} key={submission.id}>
                <div><span className="row-kicker">{formatLabel[submission.format]} · {territoryLabel[submission.territory]}</span><h3>{submission.title}</h3></div>
                <div className="row-meta"><StatusPill status={submission.status} /><span>Submitted {formatDate(submission.submitted_at)}</span></div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
