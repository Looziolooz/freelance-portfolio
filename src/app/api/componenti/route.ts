import { listComponents } from "@/lib/codepen-catalog";
import { success, error } from "@/lib/api-response";

// Public list — metadata only, never the code.
export async function GET() {
  try {
    return success(await listComponents());
  } catch (e) {
    console.error("Components list error:", e);
    return error("Internal server error", 500);
  }
}
