import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import App from "./App.js";
import "./global.css.proxy.js";
const rootElement = document.querySelector("#root");
ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), rootElement);
