const path = require("path")

process.env.NODE_ENV = "production"

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    clean: true
  },
  devtool: "inline-source-map",
  plugins: [],
  resolve: {
    extensions: [".ts", ".tsx", ".jsx", ".js", ".d.ts"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|d.ts)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 8888,
    compress: true,
    hot: true
  }
}
