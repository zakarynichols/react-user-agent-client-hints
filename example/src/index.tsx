import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"

const rootEl = document.getElementById("root")

if (rootEl === null) throw new Error("A root element is not in the DOM")

const root = ReactDOM.createRoot(rootEl)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
