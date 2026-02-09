import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@svidio/ui', '@svidio/types', '@svidio/video-core'],
  output: 'standalone',
};

export default nextConfig;
