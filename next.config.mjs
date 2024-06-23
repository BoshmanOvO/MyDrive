/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    typescript : {
      ignoreBuildErrors : true
    },
    remotePatterns: [
      {
        protocol: "https",
        hostname: "outgoing-mongoose-207.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
