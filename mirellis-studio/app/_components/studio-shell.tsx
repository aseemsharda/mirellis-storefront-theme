import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { isEditor, type StudioProfile } from "@/lib/editorial";

export function StudioShell({ profile, children }: { profile: StudioProfile; children: React.ReactNode }) {
  return (
    <div className="studio-shell">
      <header className="studio-header">
        <Link className="wordmark" href="/workspace">MIRELLIS</Link>
        <span className="destination">Contributor Studio</span>
        <nav aria-label="Studio navigation">
          <Link href="/workspace">Workspace</Link>
          {isEditor(profile.role) && <Link href="/review">Review queue</Link>}
          <form action={signOut}><button type="submit">Sign out</button></form>
        </nav>
      </header>
      <div className="identity-strip">
        <span>{profile.display_name}</span>
        <span>{profile.role}</span>
        <span>Private workspace</span>
      </div>
      {children}
    </div>
  );
}
