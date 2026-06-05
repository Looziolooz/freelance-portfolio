import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma + the Postgres driver external to the bundler.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;
