

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { ChakraProvider,ColorModeScript,theme } from "@chakra-ui/react"
// import ColorModeSwitcher from './ColorModeSwitcher.js';
import { ChakraProvider } from "@chakra-ui/react"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode >
    {/* <ColorModeScript/> */}
    <ChakraProvider >
    {/* <ColorModeSwitcher /> */}
      <App />
    </ChakraProvider>
  </React.StrictMode>
);