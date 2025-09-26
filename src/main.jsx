import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/base.css"; // se não tiver, pode remover

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
