/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}`,
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
