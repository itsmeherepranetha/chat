/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    //domains: ['lh3.googleusercontent.com'],
    remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
  },
};

export default nextConfig;
