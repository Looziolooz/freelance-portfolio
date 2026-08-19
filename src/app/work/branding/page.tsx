"use client";

import WorkDiscipline from "@/components/WorkDiscipline";
import { getDiscipline } from "@/lib/disciplines";

// Static segment, so it resolves here and never as /work/[slug]. The page body
// lives in WorkDiscipline; this file only names which discipline it is.
export default function Page() {
  return <WorkDiscipline d={getDiscipline("branding")!} />;
}
