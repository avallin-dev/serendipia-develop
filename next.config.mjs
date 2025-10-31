/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'serendipia.nexosync.xyz',
      },
    ],
  },
  output: 'standalone'
};

export default nextConfig
