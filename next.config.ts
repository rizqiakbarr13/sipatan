import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @react-pdf/renderer memakai reconciler React kustom yang bentrok jika
  // di-bundle lewat alias React milik Next.js App Router; biarkan di-require
  // langsung oleh Node.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
