import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermisos } from '../contexts/PermisosContext';

const ProtectedRoute = ({ children }) => {
  const { tienePermiso, loading, userRole } = usePermisos();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      if (loading) {
        return;
      }

      // Si no hay rol de usuario, redirigir al login
      if (!userRole) {
        setHasAccess(false);
        setIsChecking(false);
        return;
      }

      // Verificar si tiene permiso para la ruta actual
      const currentPath = location.pathname;
      const hasPermission = tienePermiso(currentPath);
      
      setHasAccess(hasPermission);
      setIsChecking(false);
    };

    checkPermission();
  }, [location.pathname, tienePermiso, loading, userRole]);

  // Mostrar loading mientras se verifican los permisos
  if (loading || isChecking) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100%", 
        display: "flex", 
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
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si no tiene rol, redirigir al login
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // Si no tiene permiso, redirigir a una página de acceso denegado o al home
  if (!hasAccess) {
    return (
      <div style={{ 
        height: "100vh", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "var(--sapBackgroundColor)",
        padding: "2rem"
      }}>
        <h2 style={{ color: "var(--sapErrorColor)", marginBottom: "1rem" }}>
          Acceso Denegado
        </h2>
        <p style={{ color: "var(--sapTextColor)", textAlign: "center", marginBottom: "2rem" }}>
          No tienes permisos para acceder a esta página.
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "var(--sapButton_Background)",
            color: "var(--sapButton_TextColor)",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  // Si tiene permiso, mostrar el componente
  return children;
};

export default ProtectedRoute; 