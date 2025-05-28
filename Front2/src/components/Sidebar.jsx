import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUI5Theme } from "./UI5ThemeProvider";
import { usePermisos } from "../contexts/PermisosContext";
import { useAuth } from "../hooks/useAuth";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useUI5Theme();
  const { filtrarRutasSidebar, loading: permisosLoading } = usePermisos();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Definir todos los elementos del menú disponibles
  const allMenuItems = [
    { path: "/home", label: "Inicio", icon: "🏠" },
    { path: "/sistema_de_alertas", label: "Sistema de Alertas", icon: "⚠️" },
    { path: "/analisis_predictivo", label: "Análisis Predictivo", icon: "📊" },
    { path: "/inventario", label: "Inventario", icon: "📦" },
    { path: "/analisis_de_inventario", label: "Análisis de Inventario", icon: "📈" },
    { path: "/metricas", label: "Métricas", icon: "📉" },
    { path: "/admin", label: "Admin", icon: "⚙️" },
    { path: "/chat", label: "Chat", icon: "💬" },
    { path: "/compras", label: "Compras", icon: "🛒" },
    { path: "/gestion_proveedores", label: "Gestión de Proveedores", icon: "🤝" },
    { path: "/ordenes", label: "Órdenes", icon: "📋" },
    { path: "/ventas", label: "Ventas", icon: "🛍️" }
  ];

  // Filtrar elementos del menú basado en permisos
  const menuItems = useMemo(() => {
    if (permisosLoading) {
      return []; // No mostrar elementos mientras se cargan los permisos
    }
    
    return filtrarRutasSidebar(allMenuItems);
  }, [filtrarRutasSidebar, permisosLoading]);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Header */}
      <div
        className="header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
          borderBottom: "1px solid " + (isDarkMode ? "#333" : "#e0e0e0"),
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
          zIndex: 100
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button
            style={{
              fontSize: "24px",
              cursor: "pointer",
              color: isDarkMode ? "#fff" : "#000",
              padding: "8px",
              background: "none",
              border: "none"
            }}
            onMouseEnter={() => setIsOpen(true)}
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: isDarkMode ? "#fff" : "#000"
            }}
          >
            Spider System
          </span>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          {user && (
            <span style={{ 
              color: isDarkMode ? "#fff" : "#000",
              fontSize: "14px",
              marginRight: "10px"
            }}>Hola, {user.name}
            </span>
          )}
          <button
            onClick={toggleDarkMode}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: isDarkMode ? "#fff" : "#000"
            }}
            aria-label="Toggle theme"
          >
            {isDarkMode ? "🌞" : "🌙"}
          </button>
          <button
            onClick={() => navigate("/cuenta")}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: isDarkMode ? "#fff" : "#000"
            }}
            aria-label="Mi cuenta"
          >
            👤
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              color: isDarkMode ? "#fff" : "#000"
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            🚪
          </button>
        </div>
      </div>

      {/* Contenedor principal */}
      <div
        style={{
          display: "flex",
          marginTop: "60px",
          minHeight: "calc(100vh - 60px)"
        }}
      >
        {/* Sidebar accesible */}
        <aside
          role="navigation"
          aria-label="Menú lateral"
          tabIndex={0}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onTouchStart={() => setIsOpen(true)}
          onTouchEnd={() => setIsOpen(false)}
          style={{
            width: isOpen ? "250px" : "60px",
            backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
            borderRight: "1px solid " + (isDarkMode ? "#333" : "#e0e0e0"),
            transition: "width 0.3s ease",
            overflowX: "hidden",
            flexShrink: 0
          }}
        >
          <nav style={{ padding: "20px 0" }}>
            {permisosLoading ? (
              // Mostrar loading mientras se cargan los permisos
              <div style={{ 
                padding: "20px", 
                textAlign: "center",
                color: isDarkMode ? "#fff" : "#000"
              }}>
                Cargando...
              </div>
            ) : (
              menuItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <div
                    key={item.path}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNavigate(item.path)}
                    onKeyDown={(e) => e.key === "Enter" && handleNavigate(item.path)}
                    style={{
                      padding: "12px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      backgroundColor: active
                        ? isDarkMode
                          ? "#333"
                          : "#f0f0f0"
                        : "transparent",
                      color: isDarkMode ? "#fff" : "#000",
                      transition: "background-color 0.2s",
                      whiteSpace: "nowrap"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode
                        ? "#444"
                        : "#e0e0e0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = active
                        ? isDarkMode
                          ? "#333"
                          : "#f0f0f0"
                        : "transparent";
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    <span
                      style={{
                        opacity: isOpen ? 1 : 0,
                        transition: "opacity 0.3s",
                        overflow: "hidden"
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })
            )}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: isDarkMode ? "#121212" : "#f5f5f5",
            transition: "margin-left 0.3s ease",
            overflow: "auto"
          }}
        >
          {/* Aquí va el <Outlet /> o el contenido de cada ruta */}
        </main>
      </div>
    </>
  );
}
