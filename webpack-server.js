const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const config = require("./webpack.config")

const compiler = webpack(config)
const devServerOptions = { ...config.devServer, open: true }
const server = new WebpackDevServer(devServerOptions, compiler)

const runServer = async () => {
  console.log("Starting server...")
  await server.start()
}

runServer()
