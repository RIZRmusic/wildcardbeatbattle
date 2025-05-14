import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/styles.css"  // This line changed from "./styles.css" to "./styles/styles.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
