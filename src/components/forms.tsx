"use client";

import { useState } from "react";
import { toast } from "sonner";
import { friendlyFirebaseError } from "@/lib/firebase-errors";

export function AuthForm({
  mode,
  onSubmit,
}: {
  mode: "login" | "register" | "forgot";
  onSubmit: (values: { name: string; email: string; password: string }) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        const form = new FormData(event.currentTarget);
        try {
          await onSubmit({
            name: String(form.get("name") || ""),
            email: String(form.get("email") || ""),
            password: String(form.get("password") || ""),
          });
        } catch (error) {
          toast.error(friendlyFirebaseError(error));
        } finally {
          setBusy(false);
        }
      }}
    >
      {mode === "register" && <input className="input" name="name" placeholder="Full name" required />}
      <input className="input" name="email" placeholder="Email address" type="email" required />
      {mode !== "forgot" && <input className="input" name="password" placeholder="Password" type="password" minLength={6} required />}
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</button>
    </form>
  );
}
