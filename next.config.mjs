/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['whatsapp-web.js', 'qrcode-terminal', 'puppeteer']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('whatsapp-web.js')
    }
    return config
  },
  env: {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
    PUPPETEER_EXECUTABLE_PATH: '/usr/bin/google-chrome-stable'
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
