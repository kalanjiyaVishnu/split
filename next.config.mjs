/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ["react-resizable-panels"],
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
