/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
