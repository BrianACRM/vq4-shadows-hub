import React from "react";
import { createRoot } from "react-dom/client";
import ShadowHub from "./ShadowHub.jsx";
import SimpleAdmin from "./SimpleAdmin.jsx";
import "./App.css";

const isAdmin = window.location.pathname.toLowerCase().includes("/admin");

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="vq-site">
      <div className="shadow-sky" aria-hidden="true">
        <div className="mercury mercury-a">E-6B</div>
        <div className="mercury mercury-b">TACAMO</div>
      </div>
      {isAdmin ? <SimpleAdmin /> : <ShadowHub />}
    </div>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
