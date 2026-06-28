"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import type { AppUser, Role } from "@/lib/types";

type AuthContextValue = {
  firebaseReady: boolean;
  user: User | null;
  profile: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (name: string, email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const previewProfile: AppUser = {
  uid: "preview-admin",
  name: "Preview Admin",
  email: "shazidsaharia21@gmail.com",
  role: "admin",
  recentCourses: [],
};

async function ensureProfile(user: User): Promise<AppUser | null> {
  if (!db) return null;
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data() as AppUser;

  const email = user.email ?? "";
  const role: Role =
    email.toLowerCase() === "shazidsaharia21@gmail.com" && user.emailVerified
      ? "admin"
      : "student";
  const profile: AppUser = {
    uid: user.uid,
    name: user.displayName ?? email.split("@")[0],
    email,
    photoURL: user.photoURL ?? "",
    role,
    recentCourses: [],
    createdAt: serverTimestamp() as AppUser["createdAt"],
  };
  await setDoc(ref, profile);
  await setDoc(doc(db, "roles", user.uid), { uid: user.uid, email, role, updatedAt: serverTimestamp() });
  return profile;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(auth ? null : previewProfile);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) return;
    return auth.onAuthStateChanged(async (nextUser) => {
      setUser(nextUser);
      setProfile(nextUser ? await ensureProfile(nextUser) : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    firebaseReady: isFirebaseConfigured,
    user,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    async loginEmail(email, password) {
      if (!auth) throw new Error("Firebase is not configured.");
      await signInWithEmailAndPassword(auth, email, password);
    },
    async registerEmail(name, email, password) {
      if (!auth) throw new Error("Firebase is not configured.");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await sendEmailVerification(credential.user);
      await ensureProfile(credential.user);
      toast.success("Account created. Please verify your email.");
    },
    async loginGoogle() {
      if (!auth) throw new Error("Firebase is not configured.");
      const credential = await signInWithPopup(auth, googleProvider);
      await ensureProfile(credential.user);
    },
    async resetPassword(email) {
      if (!auth) throw new Error("Firebase is not configured.");
      await sendPasswordResetEmail(auth, email);
    },
    async logout() {
      if (!auth) return;
      await signOut(auth);
    },
  }), [loading, profile, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
