"use client";

import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { RoutineImage, SubjectCard } from "@/components/cards";
import { useSemesters, useSubjects } from "@/lib/firestore-hooks";

export default function SemesterPage() {
  const { id } = useParams<{ id: string }>();
  const number = Number(id);
  const { items: semesters } = useSemesters();
  const { items: subjects, loading } = useSubjects(number);
  const semester = semesters.find((item) => item.number === number);

  return (
    <AppShell>
      <section className="mb-6">
        <p className="font-bold text-blue-600">{semester?.subtitle}</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{semester?.title || `Semester ${number}`}</h1>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <RoutineImage title="Class Routine" url={semester?.classRoutineUrl} />
        <RoutineImage title="Exam Routine / Notice" url={semester?.examRoutineUrl} />
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-bold">Subjects</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? [1,2,3,4,5,6].map((i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-100" />) : subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
        </div>
      </section>
    </AppShell>
  );
}
