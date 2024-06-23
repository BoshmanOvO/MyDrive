/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript : {
    ignoreBuildErrors : true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "outgoing-mongoose-207.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
