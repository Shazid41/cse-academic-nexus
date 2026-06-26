import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { defaultSettings, seedSemesters, seedSubjects } from "../src/lib/data";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) throw new Error("Set FIREBASE_SERVICE_ACCOUNT to your service account JSON string.");

const serviceAccount = JSON.parse(raw);
if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();
const now = FieldValue.serverTimestamp();
const adminEmail = process.env.SEED_ADMIN_EMAIL || "shazidsaharia21@gmail.com";

async function main() {
  await db.doc("settings/site").set({ ...defaultSettings, updatedAt: now }, { merge: true });

  for (const semester of seedSemesters) {
    await db.doc(`semesters/${semester.id}`).set({ ...semester, createdAt: now, updatedAt: now }, { merge: true });
  }

  for (const subject of seedSubjects) {
    const id = subject.courseCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await db.doc(`subjects/${id}`).set({ ...subject, createdAt: now, updatedAt: now }, { merge: true });
    await db.doc(`resources/${id}`).set({ subjectId: id, driveLink: subject.driveLink || "", updatedAt: now }, { merge: true });
    await db.doc(`courseDetails/${id}`).set({ subjectId: id, description: subject.description, updatedAt: now }, { merge: true });
  }

  await db.doc("settings/bootstrap").set({
    adminEmail,
    note: "After the admin user signs in once, promote their UID in the users and roles collections if needed.",
    updatedAt: now,
  }, { merge: true });

  console.log(`Seeded ${seedSemesters.length} semesters and ${seedSubjects.length} subjects.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
