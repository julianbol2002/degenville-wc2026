/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "axwayhelufjerkejbwtn.supabase.co",
      },
    ],
  },
};

export default nextConfig;
