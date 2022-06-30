import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";

import Web3App from "./App";
import { globalStyle } from "./styles";

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

declare global {
  interface Window {
    blockies: any;
    connector: any;
  }
}

const rootDiv = document.getElementById("root")!;
const root = createRoot(rootDiv);

root.render(
  <>
    <GlobalStyle/>
    <Web3App/>
  </>,
);
