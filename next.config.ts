import type { NextConfig } from "next";
import deploymentConfig from "./vercel.json";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async headers() {
    return deploymentConfig.headers.map((rule) => ({
      ...rule,
      headers: rule.headers.map((header) =>
        process.env.NODE_ENV === "development" &&
        header.key === "Content-Security-Policy"
          ? {
              ...header,
              value: header.value
                .replace("script-src 'self'", "script-src 'self' 'unsafe-eval'")
                .replace("connect-src 'self'", "connect-src 'self' ws: wss:")
                .replace("; upgrade-insecure-requests", ""),
            }
          : header,
      ),
    }));
  },
  outputFileTracingRoot: process.cwd(),
  reactCompiler: true,
  // File-backed writing is built statically. Keep the standard rendering
  // model: Cache Components' partial streams caused hydration failures here.
  cacheComponents: false,
  images: {
    qualities: [65, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "heatmap.shymike.dev",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
