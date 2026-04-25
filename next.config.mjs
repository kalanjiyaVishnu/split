/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["react-resizable-panels"],
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
