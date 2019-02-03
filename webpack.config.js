const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const clientOutputDirectory = './dist/front';
const serverOutputDirectory = 'dist/back';

const frontConfig = {
  target: 'web',
  entry: ["./src/front/index.tsx"],
  output: {
    
    path: __dirname + "/" + clientOutputDirectory,
    filename: 'bundle.js'
  },
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(jpe?g|png|gif|mp3)$/i,
        loaders: ['file-loader']
      }
    ]
  },
  devServer: {
    port: 3000,
    contentBase: './dist/front',
    compress: true,
    open: true,
    proxy: {
      '/api': 'http://localhost:80'
    }
  },
  plugins: [
    /* new CleanWebpackPlugin([clientOutputDirectory]), */
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new FaviconsWebpackPlugin('./public/geek.png')
  ]
};

const backConfig = {
  target: 'node',
  entry: {
    server: "./src/back/server.ts",
    cron: "./src/back/Cron.ts",
    scrapper: "./src/back/jobs-scrapper/LaunchScrapping.ts"
  },
  output: {
    path: path.join(__dirname, serverOutputDirectory),
    filename: '[name].js',
  },
  externals: [nodeExternals()],
  devtool: "source-map",
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
};

module.exports = [frontConfig, backConfig];