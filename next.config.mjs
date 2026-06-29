/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'placeholdervideo.dev' },
            { protocol: 'https', hostname: 'lorem.video' },
            { protocol: 'https', hostname: 'img.youtube.com' },
        ],
    },
};

export default nextConfig;
