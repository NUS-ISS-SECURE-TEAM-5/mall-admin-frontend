"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const config = require("../config");
const { merge } = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const portfinder = require("portfinder");
const { VueLoaderPlugin } = require("vue-loader");

const HOST = process.env.HOST;
const PORT = process.env.PORT ? Number(process.env.PORT) : config.dev.port;

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      vue: "vue",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json"],
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true,
    }),
  },
  devtool: config.dev.devtool,
  devServer: {
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, "index.html"),
        },
      ],
    },
    hot: false,
    compress: true,
    host: HOST,
    port: PORT,
    open: config.dev.autoOpenBrowser,
    devMiddleware: {
      publicPath: config.dev.assetsPublicPath,
    },
    proxy: Array.isArray(config.dev.proxyTable)
      ? config.dev.proxyTable
      : Object.entries(config.dev.proxyTable || {}).map(
          ([context, options]) => ({
            context: [context],
            ...options,
          })
        ),
    client: {
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      logging: "warn",
    },
    watchFiles: {
      paths: ["src/**/*"],
      options: {
        poll: config.dev.poll,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": require("../config/dev.env"),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../static"),
          to: config.dev.assetsSubDirectory,
          globOptions: {
            ignore: ["**/.*"],
          },
        },
      ],
    }),
    new VueLoaderPlugin(),
  ],
});

console.log(
  "🔍 Webpack alias 配置:",
  JSON.stringify(devWebpackConfig.resolve.alias, null, 2)
);
console.log(
  "🔍 Webpack extensions:",
  JSON.stringify(devWebpackConfig.resolve.extensions, null, 2)
);
console.log(
  "🔍 Webpack module.rules:",
  JSON.stringify(
    devWebpackConfig.module.rules.map((r) => r.test),
    null,
    2
  )
);

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, newPort) => {
    if (err) {
      reject(err);
    } else {
      process.env.PORT = newPort;
      devWebpackConfig.devServer.port = newPort;

      devWebpackConfig.node = {
        __dirname: false,
        __filename: false,
        global: true,
      };
      resolve(devWebpackConfig);
    }
  });
});
