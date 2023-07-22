const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  chainWebpack: config => {
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Provide path to the file with resources
          resources: './src/assets/scss/index.scss',
        })
        .end();
    });
  },
  configureWebpack: {
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
      },
    },
    externals: {
      sharedb: 'sharedb',
    },
  },
};
