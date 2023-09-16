import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, theme } from "@chakra-ui/react";
import App from "./App";
// import ColorModeSwitcher from './ColorModeSwitcher.js';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ColorModeSwitcher/> */}
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
    {/* <ColorModeSwitcher /> */}
  </React.StrictMode>
);
