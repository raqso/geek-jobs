const path = require('path');

const serverOutputDirectory = 'dist/back';

const backConfig = {
  name: 'backend',
  target: 'node',
  entry: {
    server: './src/back/server.ts',
    cron: './src/back/Cron.ts',
    scrapper: './src/back/jobs-scrapper/LaunchScrapping.ts',
    download: './src/back/jobs-scrapper/scripts/downloadOffers.ts'
  },
  output: {
    path: path.join(__dirname, serverOutputDirectory),
    filename: '[name].js'
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty'
  }
};

module.exports = [frontConfig, backConfig];
