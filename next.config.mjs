const isProd = process.env.NODE_ENV === 'production';
const repository = 'HackaRun-Project-';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  basePath: isProd ? `/${repository}` : '',
  assetPrefix: isProd ? `/${repository}/` : '',
};

export default nextConfig;
