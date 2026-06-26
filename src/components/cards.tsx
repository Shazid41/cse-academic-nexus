"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, FileText, ImageIcon } from "lucide-react";
import type { Semester, Subject } from "@/lib/types";

export function SemesterCard({ semester }: { semester: Semester }) {
  return (
    <Link href={`/semester/${semester.number}`} className="card group block overflow-hidden p-5 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">{semester.subtitle}</span>
        <ArrowRight className="text-blue-600 opacity-0 group-hover:opacity-100" size={20} />
      </div>
      <h2 className="mt-8 text-2xl font-bold">{semester.title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{semester.totalCredits} credits</p>
    </Link>
  );
}

export function SubjectCard({ subject }: { subject: Subject }) {
  return (
    <Link href={`/course/${subject.id}`} className="card group block p-5 hover:-translate-y-1 hover:border-blue-300">
      <p className="font-mono text-sm font-bold text-blue-600">{subject.courseCode}</p>
      <h3 className="mt-3 text-lg font-bold leading-snug">{subject.courseTitle}</h3>
      <p className="mt-4 flex items-center gap-2 text-sm text-[var(--muted)]"><FileText size={16} /> Details page</p>
    </Link>
  );
}

export function RoutineImage({ title, url }: { title: string; url?: string }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[var(--line)] p-4 font-bold"><CalendarDays size={18} /> {title}</div>
      {url ? (
        <Image unoptimized src={url} alt={title} width={1200} height={700} className="h-72 w-full object-cover md:h-96" />
      ) : (
        <div className="grid h-72 place-items-center bg-blue-50 text-center text-blue-700 dark:bg-slate-900 md:h-96">
          <div><ImageIcon className="mx-auto mb-3" /><p className="font-bold">No image uploaded yet</p><p className="text-sm">Admin can upload or replace it anytime.</p></div>
        </div>
      )}
    </div>
  );
}
