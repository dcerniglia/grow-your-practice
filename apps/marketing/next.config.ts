import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@gyp/shared', '@gyp/ui'],
};

export default nextConfig;
