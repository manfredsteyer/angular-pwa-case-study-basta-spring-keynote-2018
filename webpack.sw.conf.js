const path = require('path');

module.exports = {
  entry: './src/sw.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'sw.js',
    path: path.resolve(__dirname, 'dist')
  }
};
