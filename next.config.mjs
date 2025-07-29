// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dwgnuaytl/image/upload/**', // ★★★ আপনার ক্লাউডিনারি পাথ যোগ করুন ★★★
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/u/**',
      },
      // লোকালহোস্টের জন্য এটি দরকার নেই, যদি না আপনি লোকাল সার্ভার থেকে ছবি দেখান
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      // },
    ],
  },
};

export default nextConfig;