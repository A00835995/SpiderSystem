import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useUI5Theme } from "../components/UI5ThemeProvider";
import { PermisosProvider } from "../contexts/PermisosContext";
import ProtectedRoute from "../components/ProtectedRoute";
import AppInitializer from "../components/AppInitializer";

// Lazy loading de las páginas
const LazyLogin = React.lazy(() => import("../pages/Login"));
const LazyInicio = React.lazy(() => import("../pages/Inicio"));
const LazyAlertas = React.lazy(() => import("../pages/Alertas"));
const LazyPredictivo = React.lazy(() => import("../pages/Predictivo"));
const LazyInventario = React.lazy(() => import("../pages/Inventario"));
const LazyAnalisisInv = React.lazy(() => import("../pages/Analisis_Inv"));
const LazyMetricas = React.lazy(() => import("../pages/Metricas"));
const LazyAdmin = React.lazy(() => import("../pages/Admin"));
const LazyCompras = React.lazy(() => import("../pages/Compras"));
const LazyGestionProveedores = React.lazy(() => import("../pages/Gestion_de_Proveedores"));
const LazyComprasProveedor = React.lazy(() => import("../pages/ComprasProveedor"));
const LazyVentas = React.lazy(() => import("../pages/Ventas"));
const LazyCuenta = React.lazy(() => import("../pages/Cuenta"));
const LazyChatPage = React.lazy(() => import("../pages/ChatPage"));

const spinnerStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .custom-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
`;

const Loading = () => (
  <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "var(--sapBackgroundColor)" }}>
    <style>{spinnerStyles}</style>
    <div className="custom-spinner" />
  </div>
);

const PageWrapper = ({ component: Component }) => (
  <React.Suspense fallback={<Loading />}>
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  </React.Suspense>
);

function Layout() {
  const location = useLocation();
  const [sidebarWidth, setSidebarWidth] = useState(64);
  const [isMobile, setIsMobile] = useState(false);

  const isLoginPage = location.pathname === "/";

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleSidebarResize = (width) => setSidebarWidth(width);

  if (!isLoginPage) {
    return (
      <div style={{ height: "100vh", width: "100%", position: "relative", display: "flex" }}>
        <Sidebar onResize={handleSidebarResize} />
        <div style={{ flex: 1, marginLeft: isMobile ? 0 : sidebarWidth, transition: "margin-left 0.3s ease", height: "100%", overflowY: "auto", paddingTop: isMobile ? "2.75rem" : 0, backgroundColor: "var(--sapBackgroundColor)" }}>
          <Routes>
            <Route path="/home" element={<PageWrapper component={LazyInicio} />} />
            <Route path="/sistema_de_alertas" element={<PageWrapper component={LazyAlertas} />} />
            <Route path="/analisis_predictivo" element={<PageWrapper component={LazyPredictivo} />} />
            <Route path="/inventario" element={<PageWrapper component={LazyInventario} />} />
            <Route path="/analisis_de_inventario" element={<PageWrapper component={LazyAnalisisInv} />} />
            <Route path="/metricas" element={<PageWrapper component={LazyMetricas} />} />
            <Route path="/admin" element={<PageWrapper component={LazyAdmin} />} />
            <Route path="/compras" element={<PageWrapper component={LazyCompras} />} />
            <Route path="/gestion_proveedores" element={<PageWrapper component={LazyGestionProveedores} />} />
            <Route path="/ordenes" element={<PageWrapper component={LazyComprasProveedor} />} />
            <Route path="/ventas" element={<PageWrapper component={LazyVentas} />} />
            <Route path="/cuenta" element={<PageWrapper component={LazyCuenta} />} />
            <Route path="/chat" element={<PageWrapper component={LazyChatPage} />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <React.Suspense fallback={<Loading />}>
          <LazyLogin />
        </React.Suspense>
      } />
    </Routes>
  );
}

export function MyRoutes() {
  return (
    <BrowserRouter>
      <PermisosProvider>
        <AppInitializer>
          <Layout />
        </AppInitializer>
      </PermisosProvider>
    </BrowserRouter>
  );
}
