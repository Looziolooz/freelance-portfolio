import { notFound } from "next/navigation";
import SolutionPage from "@/components/SolutionPage";
import { SOLUTIONS, getSolution } from "@/lib/solutions";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();
  return <SolutionPage s={s} />;
}
