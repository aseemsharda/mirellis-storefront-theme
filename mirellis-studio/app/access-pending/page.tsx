import { signOut } from "@/app/auth/actions";
import { MirellisBrand } from "@/app/_components/mirellis-brand";

export default function AccessPendingPage() {
  return (
    <main className="centered-shell">
      <a className="wordmark" href="https://mirellis.in" aria-label="Mirellis website"><MirellisBrand /></a>
      <section className="message-card">
        <p className="eyebrow">Access not provisioned</p>
        <h1>Your identity is verified, but this studio role is not active.</h1>
        <p>Mirellis must add your contributor or editor profile before any confidential work becomes visible. No submission data has been exposed.</p>
        <p>Reply to your invitation or use the Mirellis contact route if this is unexpected.</p>
        <form action={signOut}>
          <button className="button button-secondary" type="submit">Sign out</button>
        </form>
      </section>
    </main>
  );
}
