"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import AssistantWidget from "@/components/AssistantWidget";
import SmoothScroll from "@/components/SmoothScroll";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SmoothScroll />
      {children}
      <AssistantWidget />
    </AuthProvider>
  );
}
