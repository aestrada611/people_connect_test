import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";

const root = document.createElement("div");
document.body.appendChild(root);
const app = <App />;
const rootElement = ReactDOM.createRoot(root);
rootElement.render(app);
