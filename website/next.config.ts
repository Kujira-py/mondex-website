import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep this site independent from the preserved project in the repository root.
  turbopack: { root: process.cwd() },
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
