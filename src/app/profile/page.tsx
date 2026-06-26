"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/context/auth-context";
import { useSubjects } from "@/lib/firestore-hooks";

export default function ProfilePage() {
  const { profile, logout } = useAuth();
  const { items: subjects } = useSubjects();
  const recent = subjects.filter((subject) => profile?.recentCourses?.includes(subject.id));
  return (
    <AppShell>
      <section className="card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Image unoptimized src={profile?.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${profile?.name || "Student"}`} alt="" width={96} height={96} className="size-24 rounded-3xl" />
          <div>
            <h1 className="text-3xl font-bold">{profile?.name}</h1>
            <p className="mt-1 text-[var(--muted)]">{profile?.email}</p>
            <p className="mt-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">{profile?.role}</p>
          </div>
        </div>
        <button className="btn-soft mt-6" onClick={logout}><LogOut size={18} /> Logout</button>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Recent Courses</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {recent.length ? recent.map((course) => (
            <Link className="card p-5" href={`/course/${course.id}`} key={course.id}>
              <p className="font-mono text-blue-600">{course.courseCode}</p>
              <h3 className="mt-2 font-bold">{course.courseTitle}</h3>
            </Link>
          )) : <p className="text-[var(--muted)]">Open a course to build your recent list.</p>}
        </div>
      </section>
    </AppShell>
  );
}
