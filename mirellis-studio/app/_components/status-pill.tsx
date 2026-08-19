import { statusLabel, type SubmissionStatus } from "@/lib/editorial";

export function StatusPill({ status }: { status: SubmissionStatus }) {
  return <span className={`status-pill status-${status}`}>{statusLabel[status]}</span>;
}
