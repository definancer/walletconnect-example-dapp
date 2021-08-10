import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import Web3App from "./Web3App";
import { globalStyle } from "./styles";
const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

declare global {
  // tslint:disable-next-line
  interface Window {
    blockies: any;
    connector:any;
  }
}

ReactDOM.render(
  <>
    <GlobalStyle />
    <Web3App />
  </>,
  document.getElementById("root"),
);
