import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.css"
import Router from "./Router";
import Nav from "./components/Nav";

ReactDOM.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
  document.getElementById("root")
);
