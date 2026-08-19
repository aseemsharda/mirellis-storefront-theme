"use client";

import { useActionState } from "react";
import { requestSignInLink } from "@/app/auth/actions";
import type { ActionState } from "@/lib/validation";

const initialState: ActionState = { ok: false, message: "" };

export function SignInForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(requestSignInLink, initialState);

  return (
    <form action={action} className="signin-form" noValidate>
      <label htmlFor="email">Invited email address</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        aria-describedby="signin-help signin-status"
        aria-invalid={state.field === "email"}
        disabled={!configured || pending}
        required
      />
      <p id="signin-help" className="field-help">
        There is no public registration. Use the address named in your invitation.
      </p>
      <p id="signin-status" className="form-status" aria-live="polite">
        {!configured ? "Development setup is complete; the private database connection is still required." : state.message}
      </p>
      <button className="button button-primary" type="submit" disabled={!configured || pending}>
        {pending ? "Sending secure link…" : "Email me a secure link"}
      </button>
    </form>
  );
}
