const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  favicon: path.join(__dirname, "examples/src/favicon.png"),
  template: path.join(__dirname, "examples/src/index.html"),
  filename: "./index.html"
});

module.exports = {
  entry: {
    app: [path.join(__dirname, "examples/src/index.tsx")],
    vendor: ["react", "react-dom"]
  },
  output: {
    path: path.join(__dirname, "examples/dist"),
    filename: "js/[name].bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ["file-loader", "image-webpack-loader"]
      }
    ]
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".png"]
  },
  devServer: {
    port: 3001
  }
};
