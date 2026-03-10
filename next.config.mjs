/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ["puppeteer", "puppeteer-core", "@sparticuz/chromium"],
}

export default nextConfig
