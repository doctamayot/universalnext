const withTM = require('next-transpile-modules')([
  '@square/web-sdk',
  'react-square-web-payments-sdk',
]);

module.exports = withTM({
  reactStrictMode: false,
  images: { domains: ['res.cloudinary.com'] },
  experimental: {
    esmExternal: 'loose',
  },
});
