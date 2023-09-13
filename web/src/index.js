import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider,ColorModeScript,theme } from "@chakra-ui/react";
import App from "./App";
import ColorModeSwitcher from './ColorModeSwitcher.js';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <App />
    <ColorModeScript/>
    <ChakraProvider theme={theme}>
    <ColorModeSwitcher />
    </ChakraProvider>
  </React.StrictMode>
);
