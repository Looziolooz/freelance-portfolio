"use client";

import { useLang } from "./LangProvider";
import BentoGrid from "./BentoGrid";

// Standalone services section (id="servizi").
export default function BentoShift() {
  const { t } = useLang();
  return (
    <section id="servizi" className="bento-sec" aria-label={t("bento.title")}>
      <BentoGrid />
    </section>
  );
}
