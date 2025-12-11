// src/components/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";              // sefolder -> "./App"
import "../styles/index.css";         // naik 1 folder -> "../styles/index.css"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



