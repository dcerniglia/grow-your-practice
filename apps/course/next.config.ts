import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@gyp/shared', '@gyp/ui', '@gyp/database'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
