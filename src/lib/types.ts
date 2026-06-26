import type { Timestamp } from "firebase/firestore";

export type Role = "admin" | "student";

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: Role;
  recentCourses?: string[];
  createdAt?: Timestamp;
};

export type Semester = {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  totalCredits: number;
  classRoutineUrl?: string;
  examRoutineUrl?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type Subject = {
  id: string;
  courseCode: string;
  courseTitle: string;
  semester: number;
  description: string;
  credits: number;
  teacher?: string;
  driveLink?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type SiteSettings = {
  homepageTitle: string;
  homepageSubtitle: string;
  supportEmail: string;
};
