const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    skipWaiting: true,
    register: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
});
