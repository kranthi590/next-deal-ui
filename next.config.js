const withCSS = require('@zeit/next-css');

module.exports = withCSS({
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
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/app': { page: '/' },
      '/app/user/signin': { page: '/signin' },
      '/app/business/register': { page: '/buyer-registration' },
      '/app/supplier/register': { page: '/supplier-registration' },
      '/app/user/register': { page: '/signup' },
      '/app/dashboard': { page: '/dashboard' },
      '/app/project/create': { page: '/new-project' },
      '/app/projects': { page: '/projects' },
      '/app/404': { page: '/404' },
      '/app/profile': { page: '/profile' },
    }
  },
});

