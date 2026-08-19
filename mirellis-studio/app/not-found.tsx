import Link from "next/link";

export default function NotFound() {
  return <main className="centered-shell"><section className="message-card"><p className="eyebrow">Not available</p><h1>This private record cannot be opened.</h1><p>It may not exist, or your studio role may not permit access.</p><Link className="text-link" href="/workspace">Return to workspace</Link></section></main>;
}
