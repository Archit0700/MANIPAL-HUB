/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'photo-sphere-viewer-data.netlify.app',
      },
    ],
  },
};

module.exports = nextConfig;
