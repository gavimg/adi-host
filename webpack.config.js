const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'eval-source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: 'http://localhost:3000/',
    uniqueName: 'adiHost', // ✅ IMPORTANT
    clean: true,
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'adiHost',

      remotes: {
        adiUsers: 'adiUsers@http://localhost:3001/remoteEntry.js',
        adiReports: 'adiReports@http://localhost:3002/remoteEntry.js',
        adiSettings: 'adiSettings@http://localhost:3003/remoteEntry.js',
      },

      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^19.0.0',
        },
        'react-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^19.0.0',
        },
        'react-router-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^6.0.0',
        },

        // 🔥 CRITICAL: share your internal libs
        '@gadagi/design-system': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^1.0.0',
        },
        '@gadagi/types': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^1.0.0',
        },
        '@gadagi/auth': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^1.0.0',
        },
        '@gadagi/ui-header': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^1.0.0',
        },
        '@gadagi/ui-navigation': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '^1.0.0',
        },
      },
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
