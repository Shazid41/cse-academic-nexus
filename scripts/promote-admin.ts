import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) throw new Error("Set FIREBASE_SERVICE_ACCOUNT to your service account JSON string.");

const email = process.env.ADMIN_EMAIL || "shazidsaharia21@gmail.com";
const serviceAccount = JSON.parse(raw);

if (!getApps().length) initializeApp({ credential: cert(serviceAccount) });

async function main() {
  const user = await getAuth().getUserByEmail(email);
  const db = getFirestore();
  const now = FieldValue.serverTimestamp();

  await db.doc(`users/${user.uid}`).set({
    uid: user.uid,
    name: user.displayName || email.split("@")[0],
    email,
    photoURL: user.photoURL || "",
    role: "admin",
    updatedAt: now,
  }, { merge: true });

  await db.doc(`roles/${user.uid}`).set({
    uid: user.uid,
    email,
    role: "admin",
    updatedAt: now,
  }, { merge: true });

  console.log(`${email} is now an admin.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
