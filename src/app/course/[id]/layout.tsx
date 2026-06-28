import { seedSubjects } from "@/lib/data";

export function generateStaticParams() {
  return seedSubjects.map((subject) => ({
    id: subject.courseCode.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  }));
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
