/* eslint-env node */

import * as path from 'path';

import CopyPlugin from 'copy-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { type Configuration as WebpackConfiguration, EnvironmentPlugin } from 'webpack';
import { type Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

import { DynamicConsoleRemotePlugin } from './src/webpack';
import { extensions, pluginMetadata } from './plugin-manifest';

const isProd = process.env.NODE_ENV === 'production';

const pathTo = (relativePath: string) => path.resolve(__dirname, relativePath);

const config: WebpackConfiguration & {
  devServer: WebpackDevServerConfiguration;
} = {
  mode: isProd ? 'production' : 'development',
  context: pathTo('src'),
  entry: {}, // entry generated by `DynamicConsoleRemotePlugin`
  output: {
    path: pathTo('dist'),
    publicPath: `/api/plugins/${pluginMetadata.name}/`,
    chunkFilename: isProd ? 'chunks/[name].[chunkhash:8].min.js' : 'chunks/[name].js',
    assetModuleFilename: isProd ? 'assets/[name].[contenthash:8][ext]' : 'assets/[name][ext]',
    filename: isProd ? '[name]-bundle-[hash:8].min.js' : '[name]-bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: pathTo('tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.s?(css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff2?|ttf|eot|otf)(\?.*$|$)/,
        type: 'asset/resource',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  devServer: {
    static: './dist',
    port: 9001,
    // Allow bridge running in a container to connect to the plugin dev server.
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
    },
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    new DynamicConsoleRemotePlugin({
      pluginMetadata,
      extensions,
    }),
    new CopyPlugin({
      patterns: [{ from: '../locales', to: '../dist/locales' }],
    }),
    new EnvironmentPlugin({
      NODE_ENV: isProd ? 'production' : 'development',
    }),
  ],
  devtool: 'source-map',
  optimization: {
    chunkIds: isProd ? 'deterministic' : 'named',
    minimize: isProd ? true : false,
  },
};

export default config;
