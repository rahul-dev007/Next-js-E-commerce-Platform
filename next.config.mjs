// next.config.mjs (তোমার কোড, সঠিকভাবে আপডেট করা)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ESLint error গুলো Vercel build এ skip হবে
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Cloudinary-এর সব ছবির জন্য
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub-এর ছবির জন্য
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google-এর ছবির জন্য
        port: '',
        pathname: '/**',
      },
      // ★★★★★ নতুন কনফিগারেশনটি এখানে যোগ করা হয়েছে ★★★★★
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // UI Avatars API-এর ছবির জন্য
        port: '',
        pathname: '/api/**', // শুধু /api/ পাথ থেকে ছবি লোড হবে
      },
    ],
  },
};

export default nextConfig;