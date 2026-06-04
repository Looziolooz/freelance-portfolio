import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma + better-sqlite3 are native Node modules. Keep them external so the
  // bundler never tries to trace the native .node binary or Edge-bundle them.
  // The agent runtime reads the Content model on the Node runtime only.
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-better-sqlite3",
    "better-sqlite3",
  ],
};

export default nextConfig;
