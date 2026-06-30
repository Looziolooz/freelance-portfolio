import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Pin the Turbopack workspace root to this project. Without it, Next walks up
// and finds a stray lockfile (e.g. C:\Users\loren\package-lock.json) and warns
// about inferring the wrong root.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  // Serve next/image output as AVIF first (≈20% smaller than WebP), falling back
  // to WebP. Encoding is cached after the first request, so the cost is paid once.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Keep Prisma + the Postgres driver external to the bundler.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  // The component gallery reads the raw pens from /codepen at request time; make
  // sure those files are traced into the serverless functions on deploy.
  outputFileTracingIncludes: {
    "/api/componenti/**": ["./codepen/**"],
  },
};

export default nextConfig;
