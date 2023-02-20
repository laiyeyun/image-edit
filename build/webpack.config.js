const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const rootPath = path.resolve(__dirname, "../");
module.exports = {
  mode: "development",
  entry: path.join(rootPath, "src", "main.ts"),
  watch: true,
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
  devtool: "source-map",
  devServer: {
    contentBase: path.join(rootPath, "/demo/"),
    inline: true,
    host: "192.168.0.104",
    port: 5678,
  },
};
