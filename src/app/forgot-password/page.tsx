"use client";

import Link from "next/link";
import { toast } from "sonner";
import { AuthLayout } from "@/components/app-shell";
import { AuthForm } from "@/components/forms";
import { useAuth } from "@/context/auth-context";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="mt-2 text-[var(--muted)]">We will send a secure reset email.</p>
        <div className="card mt-6 p-6">
          <AuthForm mode="forgot" onSubmit={async ({ email }) => { await resetPassword(email); toast.success("Reset link sent."); }} />
          <p className="mt-5 text-sm text-[var(--muted)]"><Link className="font-semibold text-blue-600" href="/login">Back to login</Link></p>
        </div>
      </div>
    </AuthLayout>
  );
}
