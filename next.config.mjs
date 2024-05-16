/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // standalone means the output will be a single file
  productionBrowserSourceMaps: false, // enable source maps in production, 
}

export default nextConfig
