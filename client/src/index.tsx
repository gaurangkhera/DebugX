import React from "react";
import ReactDOM from "react-dom";
import "./styles/global.css"
import Router from "./Router";

class Doc extends React.Component{
  componentDidMount(){
    document.title = "Nimbus"
  }

  render(){
    return(
      <></>
    )
  }
}

ReactDOM.render(
  
  <React.StrictMode>
    <Router />
    <Doc />
  </React.StrictMode>,
  document.getElementById("root")
);
