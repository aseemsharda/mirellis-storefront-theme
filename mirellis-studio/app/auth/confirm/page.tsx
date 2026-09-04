"use client";

import type { EmailOtpType } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createStudioBrowserClient } from "@/lib/supabase/browser";
import { MirellisBrand } from "@/app/_components/mirellis-brand";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/workspace";
}

export default function ConfirmSignInPage() {
  const [message, setMessage] = useState("Finishing your secure sign in…");

  useEffect(() => {
    let active = true;

    async function confirm() {
      const supabase = createStudioBrowserClient();
      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const next = safeNext(query.get("next"));
      let error: Error | null = null;

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = query.get("code");
      const tokenHash = query.get("token_hash");
      const type = query.get("type") as EmailOtpType | null;

      if (accessToken && refreshToken) {
        const result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        error = result.error;
      } else if (code) {
        const result = await supabase.auth.exchangeCodeForSession(code);
        error = result.error;
      } else if (tokenHash && type) {
        const result = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });
        error = result.error;
      } else {
        const result = await supabase.auth.getSession();
        error = result.error ?? (result.data.session ? null : new Error("Missing session"));
      }

      window.history.replaceState(null, "", window.location.pathname);

      if (!error) {
        window.location.replace(next);
        return;
      }

      if (active) {
        setMessage("That sign-in link is invalid or has expired.");
        window.setTimeout(() => window.location.replace("/?reason=expired"), 1200);
      }
    }

    void confirm();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="centered-shell">
      <a className="wordmark" href="https://mirellis.in" aria-label="Mirellis website"><MirellisBrand /></a>
      <section className="message-card" aria-labelledby="confirm-title">
        <p className="eyebrow">Mirellis Studio</p>
        <h1 id="confirm-title">Secure sign in</h1>
        <p role="status" aria-live="polite">
          {message}
        </p>
      </section>
    </main>
  );
}
