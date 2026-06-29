"use client";

import dynamic from "next/dynamic";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SmoothScroll from "@/components/SmoothScroll";
import type { ReactNode } from "react";

// The floating assistant isn't needed for first paint — load it client-side after
// hydration so its JS doesn't inflate the initial bundle / block the main thread.
const AssistantWidget = dynamic(() => import("@/components/AssistantWidget"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SmoothScroll />
      {children}
      <AssistantWidget />
    </AuthProvider>
  );
}
