const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['pqvuqvlgaafcxwkhzpkv.supabase.co'],
  },
};

module.exports = withPWA(nextConfig);
