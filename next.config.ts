import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://logo.clearbit.com/*')],
    },
};

export default nextConfig;
