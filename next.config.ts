import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_COMMIT: (process.env.SOURCE_COMMIT ?? "").slice(0, 7),
  },
  allowedDevOrigins: ["192.168.100.223", "localhost:3000"],
};

export default nextConfig;
