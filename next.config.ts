import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Pin the Turbopack workspace root to this project. Without it, Next walks up
// and finds a stray lockfile (e.g. C:\Users\loren\package-lock.json) and warns
// about inferring the wrong root.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  // Keep Prisma + the Postgres driver external to the bundler.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
