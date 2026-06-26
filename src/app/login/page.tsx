"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chrome } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/app-shell";
import { AuthForm } from "@/components/forms";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { loginEmail, loginGoogle } = useAuth();
  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="mt-2 text-[var(--muted)]">Access your CSE academic resources.</p>
        <div className="card mt-6 p-6">
          <AuthForm mode="login" onSubmit={async ({ email, password }) => { await loginEmail(email, password); router.push("/"); }} />
          <button className="btn-soft mt-3 w-full" onClick={async () => { await loginGoogle(); router.push("/"); }}><Chrome size={18} /> Continue with Google</button>
          <div className="mt-5 flex justify-between text-sm">
            <Link className="font-semibold text-blue-600" href="/register">Create account</Link>
            <Link className="font-semibold text-blue-600" href="/forgot-password">Forgot password?</Link>
          </div>
        </div>
        <button className="mt-4 text-sm text-[var(--muted)]" onClick={() => toast.info("Use Firebase Console to enable Email/Password and Google providers.")}>Need setup help?</button>
      </div>
    </AuthLayout>
  );
}
