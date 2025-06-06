import React from 'react';
import { useUI5Theme } from './UI5ThemeProvider';

export const AuthImagePattern = () => {
  const { theme } = useUI5Theme();
  
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      backgroundColor: 'var(--sapBackgroundColor)',
      opacity: 1,
      backgroundImage: `radial-gradient(var(--sapContent_ForegroundBorderColor) 2px, transparent 2px)`,
      backgroundSize: '30px 30px',
      pointerEvents: 'none'
    }} />
  );
}; 