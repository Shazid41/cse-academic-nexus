export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default function SemesterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
