import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Importaciones necesarias para SAP UI5
import { ThemeProvider } from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/Assets.js";
import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/Assets.js";

// Import icons
import './icons.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
) 