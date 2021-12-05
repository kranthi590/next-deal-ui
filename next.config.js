const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');

module.exports = withPlugins(
  [
    [withCSS({
      webpack: function (config) {
        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]',
            },
          },
        });
        return config;
      },
    })],
  ],
  {
    basePath: '/app',
    assetPrefix: '/app/',
    reactStrictMode: true,
    env: {
      NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
      NEXT_PUBLIC_LOCALE_LANG: process.env.NEXT_PUBLIC_LOCALE_LANG,
      NEXT_PUBLIC_DEFAULT_LOCALE_LANG: process.env.NEXT_PUBLIC_DEFAULT_LOCALE_LANG,
      NEXT_PUBLIC_DEFAULT_LOCALE_PREFIX: process.env.NEXT_PUBLIC_DEFAULT_LOCALE_LANG,
      NEXT_PUBLIC_APP_HOST: process.env.NEXT_PUBLIC_DEFAULT_LOCALE_LANG,
      NODE_TLS_REJECT_UNAUTHORIZED: process.env.NEXT_PUBLIC_DEFAULT_LOCALE_LANG,
    }
  },
);
