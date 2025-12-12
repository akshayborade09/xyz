/** @type {import('next').NextConfig} */
// Force cache clear - Updated Dec 12, 2025
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize webpack for large client components
  webpack: (config, { isServer }) => {
    // Optimize chunk loading for better code splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 150000, // Reduced for better splitting
        minChunks: 1,
        maxAsyncRequests: 50, // Increased for more parallel loading
        maxInitialRequests: 50,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            maxSize: 150000,
          },
          billingUsage: {
            test: /[\\/]app[\\/]billing[\\/]usage[\\/]/,
            name: 'billing-usage',
            priority: 10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };
    return config;
  },
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'highcharts', 'lucide-react'],
  },
};

export default nextConfig;
