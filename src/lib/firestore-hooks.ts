"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, where, type QueryConstraint } from "firebase/firestore";
import { db } from "./firebase";
import { defaultSettings, seedSemesters, seedSubjects } from "./data";
import type { AppUser, Semester, SiteSettings, Subject } from "./types";

function previewItems<T>(name: string): T[] {
  if (name === "semesters") return seedSemesters as T[];
  if (name === "subjects") {
    return seedSubjects.map((subject) => ({
      id: subject.courseCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      ...subject,
    })) as T[];
  }
  if (name === "users") {
    return [{ uid: "preview-admin", name: "Preview Admin", email: "shazidsaharia21@gmail.com", role: "admin", recentCourses: [] }] as T[];
  }
  return [];
}

export function useCollection<T>(name: string, constraints: QueryConstraint[] = []) {
  const [items, setItems] = useState<T[]>(() => (db ? [] : previewItems<T>(name)));
  const [loading, setLoading] = useState(Boolean(db));

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, name), ...constraints);
    return onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T));
      setLoading(false);
    });
  }, [name, constraints]);

  return { items, loading };
}

export function useSemesters() {
  const constraints = useMemo(() => [orderBy("number", "asc")], []);
  return useCollection<Semester>("semesters", constraints);
}

export function useSubjects(semester?: number) {
  const constraints = useMemo(() => semester ? [where("semester", "==", semester), orderBy("courseCode", "asc")] : [orderBy("semester", "asc"), orderBy("courseCode", "asc")], [semester]);
  return useCollection<Subject>("subjects", constraints);
}

export function useUsers() {
  const constraints = useMemo(() => [orderBy("email", "asc")], []);
  return useCollection<AppUser>("users", constraints);
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
