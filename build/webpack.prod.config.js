const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const rootPath = path.resolve(__dirname, "../");
module.exports = {
  mode: "production",
  entry: path.join(rootPath, "src", "main.ts"),
  watch: false,
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        test: /\.js($|\?)/i,
        sourceMap: true,
        parallel: true,
        cache: true,
        output: {
          comments: false,
          beautify: false,
        },
        warnings: false,
      },
      sourceMap: true,
      cache: true,
      parallel: true,
    }),
  ],
  output: {
    path: path.join(rootPath, "dist"),
    publicPath: "/dist/",
    filename: "pictureEditor.min.js",
    chunkFilename: "[name].js",
    library: "PictureEditor",
    libraryTarget: "window",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        include: [path.resolve(rootPath, "src")],
        exclude: [path.resolve(rootPath, "node_modules")],
        loader: "babel-loader",
        query: {
          presets: [
            [
              "@babel/env",
              {
                targets: {
                  browsers: ["> 1%", "last 2 versions", "not ie <= 8"],
                },
              },
            ],
          ],
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".json", ".js", ".jsx"],
  },
};
