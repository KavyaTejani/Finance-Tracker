import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FinanceProvider } from "./context/FinanceContext.jsx";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FinanceProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="dark"
        toastStyle={{ backgroundColor: "#242424", color: "#fff" }}
      />
    </FinanceProvider>
  </StrictMode>
);