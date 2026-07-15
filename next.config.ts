import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // allow local dev from network (phone)
  allowedDevOrigins: ["192.168.178.*"],
};

export default withPayload(nextConfig);
