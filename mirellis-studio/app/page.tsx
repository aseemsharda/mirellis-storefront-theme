import { redirect } from "next/navigation";
import { SignInForm } from "@/app/_components/sign-in-form";
import { studioConfig } from "@/lib/config";
import { getStudioIdentity } from "@/lib/auth";
import { MirellisBrand } from "@/app/_components/mirellis-brand";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const config = studioConfig();
  if (config.configured) {
    const identity = await getStudioIdentity();
    if (identity?.profile) redirect("/workspace");
  }
  const { reason } = await searchParams;

  return (
    <main className="arrival-shell">
      <section className="arrival-story" aria-labelledby="studio-title">
        <a className="wordmark" href="https://mirellis.in" aria-label="Mirellis website">
          <MirellisBrand />
        </a>
        <p className="eyebrow">Private editorial workspace</p>
        <h1 id="studio-title">Contribute carefully. Review accountably.</h1>
        <p className="arrival-intro">
          The Mirellis Studio is where invited contributors prepare Evidence Notes and Expert Commentary before any public decision is made.
        </p>
        <div className="trust-list" aria-label="Studio promises">
          <p><span>01</span>Your draft remains private.</p>
          <p><span>02</span>Submission never guarantees publication.</p>
          <p><span>03</span>Every decision leaves a visible record.</p>
        </div>
      </section>
      <section className="arrival-panel" aria-labelledby="signin-title">
        <div className="panel-inner">
          <p className="eyebrow">Invitation only</p>
          <h2 id="signin-title">Enter the studio</h2>
          <p>We will email a one-time sign-in link. You do not need a password.</p>
          {reason === "expired" && (
            <p className="notice notice-error" role="alert">
              That sign-in link is invalid or has expired. Request a new one below.
            </p>
          )}
          {reason === "signin" && (
            <p className="notice" role="status">Sign in to continue to the private workspace.</p>
          )}
          <SignInForm configured={config.configured} />
          <p className="privacy-note">
            Unpublished work is confidential. The studio does not send submission text to third-party AI systems.
          </p>
        </div>
      </section>
    </main>
  );
}
