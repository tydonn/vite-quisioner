import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { BrowserRouter, RouterProvider } from "react-router-dom"
import { router } from "./router.tsx"

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// )

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <BrowserRouter>
//     <App />
//     <RouterProvider router={router} />
//   </BrowserRouter>
// )

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

