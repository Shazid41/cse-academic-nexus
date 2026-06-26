"use client";

import { FormEvent, useState } from "react";
import { addDoc, collection, deleteDoc, doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ImageUp, Plus, Save, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/context/auth-context";
import { db, storage } from "@/lib/firebase";
import { useSemesters, useSettings, useSubjects, useUsers } from "@/lib/firestore-hooks";
import type { Role, Subject } from "@/lib/types";

const emptySubject = { courseCode: "", courseTitle: "", semester: 1, description: "", credits: 3, teacher: "", driveLink: "" };

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const { items: semesters } = useSemesters();
  const { items: subjects } = useSubjects();
  const { items: users } = useUsers();
  const { settings } = useSettings();
  const [subject, setSubject] = useState<Omit<Subject, "id">>(emptySubject);

  if (!isAdmin) {
    return <AppShell><div className="card p-8"><h1 className="text-2xl font-bold">Admin access required</h1><p className="mt-2 text-[var(--muted)]">Only admins can manage website content.</p></div></AppShell>;
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db) return;
    const form = new FormData(event.currentTarget);
    await setDoc(doc(db, "settings", "site"), {
      homepageTitle: form.get("homepageTitle"),
      homepageSubtitle: form.get("homepageSubtitle"),
      supportEmail: form.get("supportEmail"),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    toast.success("Homepage settings updated.");
  }

  async function saveSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!db) return;
    await addDoc(collection(db, "subjects"), { ...subject, semester: Number(subject.semester), credits: Number(subject.credits), createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    setSubject(emptySubject);
    toast.success("Subject added.");
  }

  async function updateSubject(id: string, patch: Partial<Subject>) {
    if (!db) return;
    await updateDoc(doc(db, "subjects", id), { ...patch, updatedAt: serverTimestamp() });
    toast.success("Subject updated.");
  }

  async function uploadRoutine(semesterId: string, field: "classRoutineUrl" | "examRoutineUrl", file?: File) {
    if (!storage || !db || !file) return;
    const path = `semesters/${semesterId}/${field}-${file.lastModified}-${file.name}`;
    const uploaded = await uploadBytes(ref(storage, path), file);
    const url = await getDownloadURL(uploaded.ref);
    await updateDoc(doc(db, "semesters", semesterId), { [field]: url, updatedAt: serverTimestamp() });
    toast.success("Image uploaded.");
  }

  async function setRole(uid: string, email: string, role: Role) {
    if (!db) return;
    await setDoc(doc(db, "users", uid), { role }, { merge: true });
    await setDoc(doc(db, "roles", uid), { uid, email, role, updatedAt: serverTimestamp() }, { merge: true });
    toast.success("User role updated.");
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="font-bold text-blue-600">Admin CMS</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Manage academic portal</h1>
      </div>

      <section className="grid gap-6">
        <form onSubmit={saveSettings} className="card grid gap-4 p-5">
          <h2 className="text-xl font-bold">Homepage Text</h2>
          <input className="input" name="homepageTitle" defaultValue={settings.homepageTitle} />
          <textarea className="input min-h-24" name="homepageSubtitle" defaultValue={settings.homepageSubtitle} />
          <input className="input" name="supportEmail" defaultValue={settings.supportEmail} />
          <button className="btn-primary w-fit"><Save size={18} /> Save Settings</button>
        </form>

        <div className="card p-5">
          <h2 className="text-xl font-bold">Semester Routine Images</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {semesters.map((semester) => (
              <div key={semester.id} className="rounded-2xl border border-[var(--line)] p-4">
                <h3 className="font-bold">{semester.title}</h3>
                <label className="btn-soft mt-3 w-full cursor-pointer"><ImageUp size={17} /> Upload Class Routine<input hidden type="file" accept="image/*" onChange={(e) => uploadRoutine(semester.id, "classRoutineUrl", e.target.files?.[0])} /></label>
                <label className="btn-soft mt-2 w-full cursor-pointer"><ImageUp size={17} /> Upload Exam Routine / Notice<input hidden type="file" accept="image/*" onChange={(e) => uploadRoutine(semester.id, "examRoutineUrl", e.target.files?.[0])} /></label>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={saveSubject} className="card grid gap-3 p-5">
          <h2 className="text-xl font-bold">Add Subject</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <input className="input" placeholder="Course Code" value={subject.courseCode} onChange={(e) => setSubject({ ...subject, courseCode: e.target.value })} required />
            <input className="input md:col-span-2" placeholder="Course Title" value={subject.courseTitle} onChange={(e) => setSubject({ ...subject, courseTitle: e.target.value })} required />
            <select className="input" value={subject.semester} onChange={(e) => setSubject({ ...subject, semester: Number(e.target.value) })}>{semesters.map((s) => <option key={s.id} value={s.number}>{s.title}</option>)}</select>
            <input className="input" type="number" step="0.5" placeholder="Credits" value={subject.credits} onChange={(e) => setSubject({ ...subject, credits: Number(e.target.value) })} required />
            <input className="input" placeholder="Teacher" value={subject.teacher} onChange={(e) => setSubject({ ...subject, teacher: e.target.value })} />
            <input className="input md:col-span-2" placeholder="Google Drive Link" value={subject.driveLink} onChange={(e) => setSubject({ ...subject, driveLink: e.target.value })} />
          </div>
          <textarea className="input min-h-24" placeholder="Description" value={subject.description} onChange={(e) => setSubject({ ...subject, description: e.target.value })} required />
          <button className="btn-primary w-fit"><Plus size={18} /> Add Subject</button>
        </form>

        <div className="card p-5">
          <h2 className="text-xl font-bold">Edit Subjects & Resources</h2>
          <div className="mt-4 grid gap-4">
            {subjects.map((item) => <SubjectEditor key={item.id} subject={item} onUpdate={updateSubject} onDelete={async () => { if (db) { await deleteDoc(doc(db, "subjects", item.id)); toast.success("Subject deleted."); } }} />)}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck size={20} /> Manage Users</h2>
          <div className="mt-4 grid gap-3">
            {users.map((user) => (
              <div key={user.uid} className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-bold">{user.name || user.email}</p><p className="text-sm text-[var(--muted)]">{user.email}</p></div>
                <select className="input sm:w-40" value={user.role} onChange={(e) => setRole(user.uid, user.email, e.target.value as Role)}><option value="student">Student</option><option value="admin">Admin</option></select>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function SubjectEditor({ subject, onUpdate, onDelete }: { subject: Subject; onUpdate: (id: string, patch: Partial<Subject>) => Promise<void>; onDelete: () => Promise<void>; }) {
  const [draft, setDraft] = useState(subject);
  return (
    <form className="grid gap-3 rounded-2xl border border-[var(--line)] p-4" onSubmit={async (event) => { event.preventDefault(); await onUpdate(subject.id, draft); }}>
      <div className="grid gap-3 md:grid-cols-4">
        <input className="input" value={draft.courseCode} onChange={(e) => setDraft({ ...draft, courseCode: e.target.value })} />
        <input className="input md:col-span-2" value={draft.courseTitle} onChange={(e) => setDraft({ ...draft, courseTitle: e.target.value })} />
        <input className="input" type="number" value={draft.semester} onChange={(e) => setDraft({ ...draft, semester: Number(e.target.value) })} />
        <input className="input" type="number" step="0.5" value={draft.credits} onChange={(e) => setDraft({ ...draft, credits: Number(e.target.value) })} />
        <input className="input" value={draft.teacher || ""} placeholder="Teacher" onChange={(e) => setDraft({ ...draft, teacher: e.target.value })} />
        <input className="input md:col-span-2" value={draft.driveLink || ""} placeholder="Google Drive Link" onChange={(e) => setDraft({ ...draft, driveLink: e.target.value })} />
      </div>
      <textarea className="input min-h-24" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
      <div className="flex gap-2">
        <button className="btn-primary"><Save size={17} /> Save</button>
        <button type="button" className="btn-soft text-red-600" onClick={onDelete}><Trash2 size={17} /> Delete</button>
      </div>
    </form>
  );
}
