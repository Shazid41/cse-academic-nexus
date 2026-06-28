"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Moon, Search, Settings, Sun, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/admin", label: "Admin", icon: Settings, admin: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, isAdmin, logout, firebaseReady } = useAuth();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (!loading && firebaseReady && !user) router.replace("/login");
  }, [firebaseReady, loading, router, user]);

  if (loading || (firebaseReady && !user)) return <SkeletonScreen />;

  return (
    <div className="app-bg min-h-screen bg-[var(--background)]">
      <header className="glass sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-white"><GraduationCap size={22} /></span>
            <span className="hidden sm:block">CSE Academic Nexus</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/?focus=search" className="btn-soft hidden sm:inline-flex"><Search size={17} /> Search</Link>
            <button aria-label="Toggle dark mode" className="btn-soft px-3" onClick={() => setDark((value) => !value)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-soft px-3" onClick={logout} aria-label="Logout"><LogOut size={18} /></button>
          </div>
        </div>
      </header>
      {!firebaseReady && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-900">
          Preview mode: Firebase is not configured yet. Add `.env.local` to enable real login, CMS writes, uploads, and deployment data.
        </div>
      )}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="card h-fit p-3 md:sticky md:top-24">
          <div className="mb-3 flex items-center gap-3 p-2">
            <Image unoptimized src={profile?.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${profile?.name || "Student"}`} alt="" width={40} height={40} className="size-10 rounded-full" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{profile?.name || "Student"}</p>
              <p className="truncate text-xs text-[var(--muted)]">{profile?.role}</p>
            </div>
          </div>
          <nav className="grid gap-1">
            {nav.filter((item) => !item.admin || isAdmin).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold ${active ? "bg-blue-600 text-white" : "hover:bg-blue-50 dark:hover:bg-slate-800"}`}>
                  <Icon size={17} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-bg grid min-h-screen bg-white md:grid-cols-[1fr_460px] dark:bg-slate-950">
      <section className="relative hidden overflow-hidden bg-blue-600 p-10 text-white md:flex md:flex-col md:justify-between">
        <span className="auth-orb left-20 top-24" />
        <span className="auth-orb bottom-28 right-28 animation-delay-2" />
        <div className="flex items-center gap-3 text-xl font-bold"><BookOpen /> CSE Academic Nexus</div>
        <div>
          <h1 className="max-w-xl text-5xl font-bold leading-tight">Your complete BSc CSE study hub.</h1>
          <p className="mt-5 max-w-lg text-lg text-blue-100">Secure semesters, routines, notices, course details, and Drive resources managed from one Firebase CMS.</p>
        </div>
        <p className="text-sm text-blue-100">Rabindra Maitree University CSE resources portal</p>
      </section>
      <section className="flex items-center justify-center p-5">{children}</section>
    </div>
  );
}

function SkeletonScreen() {
  return <div className="mx-auto max-w-6xl animate-pulse p-6"><div className="h-14 rounded-2xl bg-slate-100" /><div className="mt-6 grid gap-4 md:grid-cols-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-40 rounded-2xl bg-slate-100" />)}</div></div>;
}
