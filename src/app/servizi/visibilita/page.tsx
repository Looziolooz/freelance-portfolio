"use client";

import ServicePage from "@/components/ServicePage";
import { getDiscipline } from "@/lib/disciplines";

// Segmento statico: il corpo della pagina vive in ServicePage, qui si dice solo
// quale disciplina e'. Metadata e JSON-LD stanno nel layout, lato server.
export default function Page() {
  return <ServicePage d={getDiscipline("visibilita")!} />;
}
