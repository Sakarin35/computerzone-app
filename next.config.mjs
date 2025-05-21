/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    // img.danawa.com 도메인에서 오는 이미지를 허용
    domains: ['img.danawa.com'],

    // Next 13+ 에서는 remotePatterns 로 좀 더 세밀하게도 설정할 수 있습니다
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.danawa.com',
        port: '',           // 기본 https 포트
        pathname: '/prod_img/**',
      },
    ],
  },
};

export default nextConfig;
