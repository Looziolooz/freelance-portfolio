"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
