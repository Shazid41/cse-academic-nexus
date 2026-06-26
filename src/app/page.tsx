"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SemesterCard, SubjectCard } from "@/components/cards";
import { useSemesters, useSettings, useSubjects } from "@/lib/firestore-hooks";

export default function Home() {
  const { settings } = useSettings();
  const { items: semesters, loading } = useSemesters();
  const { items: subjects } = useSubjects();
  const [term, setTerm] = useState("");
  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return [];
    return subjects.filter((subject) => `${subject.courseCode} ${subject.courseTitle}`.toLowerCase().includes(q)).slice(0, 12);
  }, [subjects, term]);

  return (
    <AppShell>
      <section className="mb-8">
        <p className="font-bold text-blue-600">Academic dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">{settings.homepageTitle}</h1>
        <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">{settings.homepageSubtitle}</p>
      </section>

      <section className="card mb-8 p-4">
        <div className="flex items-center gap-3">
          <Search className="text-blue-600" />
          <input className="w-full bg-transparent p-2 outline-none" autoComplete="off" placeholder="Search by course code or title" value={term} onChange={(event) => setTerm(event.target.value)} />
        </div>
        {results.length > 0 && (
          <div className="mt-4 grid gap-3 border-t border-[var(--line)] pt-4 md:grid-cols-2">
            {results.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? [1,2,3,4,5,6,7,8].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />) : semesters.map((semester) => <SemesterCard key={semester.id} semester={semester} />)}
      </section>
    </AppShell>
  );
}
