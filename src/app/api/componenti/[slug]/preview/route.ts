import { getComponentSource, buildPreviewDoc } from "@/lib/codepen-catalog";

// Public preview document for the sandboxed iframe — this is the visible result.
// (It necessarily contains the markup to render; the gated, copy-paste code panel
// is served separately by the /code route.)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const src = await getComponentSource(slug);
  if (!src) return new Response("Not found", { status: 404 });
  return new Response(buildPreviewDoc(src), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
