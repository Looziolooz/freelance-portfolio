import type { Metadata } from "next";

// Internal admin area — never indexed (robots.txt also disallows /admin).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
