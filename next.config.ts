import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
  },
});

export default withPWAConfig(config);
