/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // standalone means the output will be a single file
  productionBrowserSourceMaps: false, // enable source maps in production,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};

export default nextConfig;
