import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AppInitializer = ({ children }) => {
  const { loading: authLoading } = useAuth();

  // Mostrar loading mientras se inicializa la autenticación
  if (authLoading) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "var(--sapBackgroundColor)" 
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ 
          marginTop: "1rem", 
          color: "var(--sapTextColor)",
          fontSize: "14px"
        }}>
          Inicializando aplicación...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return children;
};

export default AppInitializer; 