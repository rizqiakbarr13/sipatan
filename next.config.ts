import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfjs-dist"],
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit regardless of app-level
      // upload validation (src/lib/storage.ts's MAX_UPLOAD_SIZE_BYTES) —
      // raise it here so uploads routed through "use server" actions
      // (dokumen, galeri, impor PDF nominatif) aren't rejected before that
      // validation even runs. Route Handlers (e.g. /api/sanggahan) aren't
      // affected by this setting, only Server Actions are.
      bodySizeLimit: "15mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
