"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ExternalLink, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/context/auth-context";
import { db } from "@/lib/firebase";
import { seedSubjects } from "@/lib/data";
import type { Subject } from "@/lib/types";

function subjectId(courseCode: string) {
  return courseCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const fallbackCourse = useMemo(() => {
    const fallback = seedSubjects.find((subject) => subjectId(subject.courseCode) === id);
    return fallback ? ({ id, ...fallback } as Subject) : null;
  }, [id]);
  const [remoteCourse, setRemoteCourse] = useState<Subject | null>(null);
  const course = remoteCourse?.id === id ? remoteCourse : fallbackCourse;

  useEffect(() => {
    if (!db || !id) return;
    getDoc(doc(db, "subjects", id)).then((snapshot) => {
      if (snapshot.exists()) setRemoteCourse({ id: snapshot.id, ...snapshot.data() } as Subject);
    });
  }, [id]);

  useEffect(() => {
    if (!db || !user || !course || profile?.recentCourses?.includes(course.id)) return;
    setDoc(doc(db, "users", user.uid), { recentCourses: [course.id, ...(profile?.recentCourses || [])].slice(0, 6), updatedAt: serverTimestamp() }, { merge: true });
  }, [course, profile?.recentCourses, user]);

  return (
    <AppShell>
      {!course ? <div className="h-96 animate-pulse rounded-2xl bg-slate-100" /> : (
        <article className="card p-6 md:p-8">
          <p className="font-mono text-blue-600">{course.courseCode}</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">{course.courseTitle}</h1>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <Info label="Credit" value={`${course.credits}`} />
            <Info label="Semester" value={`Semester ${course.semester}`} />
            <Info label="Teacher" value={course.teacher || "Not assigned"} />
          </div>
          <section className="mt-8">
            <h2 className="text-xl font-bold">Course Description</h2>
            <p className="mt-3 leading-8 text-[var(--muted)]">{course.description}</p>
          </section>
          <p className="mt-6 text-sm text-[var(--muted)]">Last updated: {course.updatedAt?.toDate ? course.updatedAt.toDate().toLocaleString() : "Not available"}</p>
          <button
            className="btn-primary mt-8 w-full py-4 text-lg"
            onClick={() => {
              if (!course.driveLink) {
                toast.error("Resources link is not available yet.");
                return;
              }
              window.open(course.driveLink, "_blank", "noopener,noreferrer");
            }}
          >
            <FolderOpen /> Resources <ExternalLink size={20} />
          </button>
        </article>
      )}
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[var(--line)] bg-[var(--background)] p-4"><p className="text-[var(--muted)]">{label}</p><p className="mt-1 font-bold">{value}</p></div>;
}
