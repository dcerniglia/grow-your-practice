import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@gyp/shared', '@gyp/ui', '@gyp/database'],
};

export default nextConfig;
