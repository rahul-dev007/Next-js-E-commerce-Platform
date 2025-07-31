// next.config.mjs

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ESLint error গুলো Vercel build এ skip হবে
  },
};

export default nextConfig;
