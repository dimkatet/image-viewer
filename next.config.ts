import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"], // Современные форматы
    deviceSizes: [640, 768, 1024, 1280, 1920], // Размеры для адаптивности
    imageSizes: [64, 128, 256, 512], // Размеры для thumbnails
    minimumCacheTTL: 60 * 60 * 24 * 30, // Кэш на 30 дней
    remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_STORAGE_URL}/**`)],
  },
};

export default nextConfig;
