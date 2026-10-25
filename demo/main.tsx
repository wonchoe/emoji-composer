import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.js";
import "../src/styles.css";
import "./theme.css";

const root = document.getElementById("root")!;
const app = <React.StrictMode><App /></React.StrictMode>;
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
