import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="centered-shell">
      <a className="wordmark" href="https://mirellis.in">MIRELLIS</a>
      <section className="message-card">
        <p className="eyebrow">Secure sign in</p>
        <h1>Check your email.</h1>
        <p>If the address belongs to an invited studio member, a one-time link is on its way. It expires after the authentication window configured by Mirellis.</p>
        <p>Open the link in this browser to continue.</p>
        <Link className="text-link" href="/">Use another address</Link>
      </section>
    </main>
  );
}
