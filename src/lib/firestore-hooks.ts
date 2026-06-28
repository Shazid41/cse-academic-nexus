"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, where, type QueryConstraint } from "firebase/firestore";
import { db } from "./firebase";
import { defaultSettings, seedSemesters, seedSubjects } from "./data";
import type { AppUser, Semester, SiteSettings, Subject } from "./types";

function subjectId(courseCode: string) {
  return courseCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function previewItems<T>(name: string, semester?: number): T[] {
  if (name === "semesters") return seedSemesters as T[];
  if (name === "subjects") {
    return seedSubjects.filter((subject) => !semester || subject.semester === semester).map((subject) => ({
      id: subjectId(subject.courseCode),
      ...subject,
    })) as T[];
  }
  if (name === "users") {
    return [{ uid: "preview-admin", name: "Preview Admin", email: "shazidsaharia21@gmail.com", role: "admin", recentCourses: [] }] as T[];
  }
  return [];
}

export function useCollection<T>(name: string, constraints: QueryConstraint[] = [], fallback: T[] = previewItems<T>(name)) {
  const [items, setItems] = useState<T[]>(() => (db ? [] : fallback));
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, name), ...constraints);
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
        setItems(data.length ? data : fallback);
        setLoading(false);
      },
      (error) => {
        console.warn(`Firestore ${name} subscription failed. Using local fallback.`, error);
        setItems(fallback);
        setLoading(false);
      },
    );
  }, [name, constraints, fallback]);

  return { items, loading };
}

export function useSemesters() {
  const constraints = useMemo(() => [orderBy("number", "asc")], []);
  const fallback = useMemo(() => previewItems<Semester>("semesters"), []);
  return useCollection<Semester>("semesters", constraints, fallback);
}

export function useSubjects(semester?: number) {
  const constraints = useMemo(() => semester ? [where("semester", "==", semester)] : [], [semester]);
  const fallback = useMemo(() => previewItems<Subject>("subjects", semester), [semester]);
  const result = useCollection<Subject>("subjects", constraints, fallback);
  const sortedItems = useMemo(() => [...result.items].sort((a, b) => a.semester - b.semester || a.courseCode.localeCompare(b.courseCode)), [result.items]);
  return { ...result, items: sortedItems };
}

export function useUsers() {
  const constraints = useMemo(() => [orderBy("email", "asc")], []);
  const fallback = useMemo(() => previewItems<AppUser>("users"), []);
  return useCollection<AppUser>("users", constraints, fallback);
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) return;
    return onSnapshot(doc(db, "settings", "site"), (snapshot) => {
      setSettings(snapshot.exists() ? ({ ...defaultSettings, ...snapshot.data() } as SiteSettings) : defaultSettings);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
