/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_ACTIONS === "true";
const repo = "HackaRun-Project-";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : ""
};

export default nextConfig;