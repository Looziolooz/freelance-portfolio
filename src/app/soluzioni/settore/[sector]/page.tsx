import { notFound } from "next/navigation";
import SectorPage from "@/components/SectorPage";
import { LIVE_SECTORS, getSector } from "@/lib/solutions";

export function generateStaticParams() {
  return LIVE_SECTORS.map((s) => ({ sector: s.slug }));
}

export default async function Page({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  const s = getSector(sector);
  if (!s) notFound();
  return <SectorPage sector={s} />;
}
