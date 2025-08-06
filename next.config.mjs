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
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      // ★★★★★ এই নতুন কনফিগারেশনটি এখানে যোগ করতে হবে ★★★★★
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash-এর ছবির জন্য
      },
    ],
  },
};

export default nextConfig;