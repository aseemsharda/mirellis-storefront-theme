import Link from "next/link";
import { SubmissionForm } from "@/app/_components/submission-form";
import { requireStudioRole } from "@/lib/auth";

export default async function NewSubmissionPage() {
  await requireStudioRole(["contributor"]);
  return (
    <main className="workspace-main form-page">
      <Link className="back-link" href="/workspace">← Back to workspace</Link>
      <div className="page-heading narrow-heading">
        <div>
          <p className="eyebrow">New private draft</p>
          <h1>Build the record before the argument.</h1>
          <p>Complete the four sections below. Nothing enters review until you choose “Submit for editorial review” on the saved draft.</p>
        </div>
      </div>
      <SubmissionForm />
    </main>
  );
}
