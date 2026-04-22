/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? "";
const isUserPage = repo.endsWith('.github.io');
const basePath = process.env.GITHUB_ACTIONS && repo && !isUserPage ? `/${repo}` : "";

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
