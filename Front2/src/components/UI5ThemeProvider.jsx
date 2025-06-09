import React, { createContext, useContext } from 'react';
import { ThemeProvider } from '@ui5/webcomponents-react';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme.js';

// Context for theme management
export const UI5ThemeContext = createContext({
  theme: 'sap_horizon'
});

// Hook for using theme context
export const useUI5Theme = () => useContext(UI5ThemeContext);

export default function UI5ThemeProvider({ children }) {
  const theme = 'sap_horizon';

  // Apply theme to UI5 components
  setTheme(theme);

  const themeContextValue = {
    theme
  };

  return (
    <UI5ThemeContext.Provider value={themeContextValue}>
      <ThemeProvider theme={{ theme }}>
        {children}
      </ThemeProvider>
    </UI5ThemeContext.Provider>
  );
} 