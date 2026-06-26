"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/app-shell";
import { AuthForm } from "@/components/forms";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { registerEmail } = useAuth();
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-[var(--muted)]">Sign up before accessing the portal.</p>
        <div className="card mt-6 p-6">
          <AuthForm mode="register" onSubmit={async ({ name, email, password }) => { await registerEmail(name, email, password); router.push("/"); }} />
          <p className="mt-5 text-sm text-[var(--muted)]">Already registered? <Link className="font-semibold text-blue-600" href="/login">Sign in</Link></p>
        </div>
      </div>
    </AuthLayout>
  );
}
