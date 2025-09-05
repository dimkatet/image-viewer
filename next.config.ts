import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/**`), new URL('http://vm75064.vpsone.xyz:8080/**')],
  },
};

export default nextConfig;
