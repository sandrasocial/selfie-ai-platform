/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'postimg.cc',
      },
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Exclude the client directory from the build
    config.externals = config.externals || [];
    config.externals.push({
      '@/components/ui/toaster': 'commonjs @/components/ui/toaster',
    });
    
    // Ignore the client directory
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /client/,
    };
    
    return config;
  },
}

module.exports = nextConfig