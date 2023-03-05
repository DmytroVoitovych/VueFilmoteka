const postcssNormalize = require('postcss-normalize');

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: () => [postcssNormalize({ forceImport: true })],
      },
    },
  },
};
