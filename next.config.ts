import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  cacheComponents: true,

  // allow local dev from network (phone)
  allowedDevOrigins: ["192.168.178.*"],

  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "**.backblazeb2.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.crimsonc9.com",
      },
    ],
  },
};

/**
 * `withPayload()` was removed when the CMS was decoupled for v1 — it only exists to wire
 * Payload's admin routes and bundler aliases into the Next build, and there are no Payload
 * routes to wire while `src/app/_payload` sits outside routing. The dependency is still
 * installed, so restoring this is one import and one wrapper.
 */
export default nextConfig;
