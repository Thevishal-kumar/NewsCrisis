import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import './index.css'
import { WalletProvider } from "./context/WalletContext.jsx";
import { ReportsProvider } from "./context/ReportsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WalletProvider>
      <ReportsProvider>
        <App />
      </ReportsProvider>
    </WalletProvider>
  </React.StrictMode>
);
