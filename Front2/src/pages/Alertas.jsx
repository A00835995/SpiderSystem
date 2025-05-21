import React, { useState, useEffect, useMemo } from "react";
import { ValueState } from "@ui5/webcomponents-react";
import { useUI5Theme } from "../components/UI5ThemeProvider";
import { styles } from "../Styles/AlertasStyle";

// Importar componentes
import AlertHeader from "../components/Alertas/AlertHeader";
import AlertFilters from "../components/Alertas/AlertFilters";
import AlertList from "../components/Alertas/AlertList";
import AlertDetailDialog from "../components/Alertas/AlertDetailDialog";

// Importar íconos necesarios
import "@ui5/webcomponents-icons/dist/alert.js";
import "@ui5/webcomponents-icons/dist/filter.js";
import "@ui5/webcomponents-icons/dist/refresh.js";
import "@ui5/webcomponents-icons/dist/decline.js";
import "@ui5/webcomponents-icons/dist/message-success.js";
import "@ui5/webcomponents-icons/dist/message-warning.js";
import "@ui5/webcomponents-icons/dist/message-error.js";
import "@ui5/webcomponents-icons/dist/error.js";
import "@ui5/webcomponents-icons/dist/warning.js";
import "@ui5/webcomponents-icons/dist/sys-enter-2.js";
import "@ui5/webcomponents-icons/dist/inventory.js";
import "@ui5/webcomponents-icons/dist/line-chart.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/check-availability.js";
import "@ui5/webcomponents-icons/dist/circle-task.js";

// Configuración de umbrales para alertas
const STOCK_THRESHOLDS = {
  CRITICAL: 5,
  WARNING: 10,
  REORDER: 15,
  HIGH_DEMAND: 20
};

// Configuración de actualización y paginación
const UPDATE_INTERVAL = 30000;
const ALERTS_PER_PAGE = 10;

// Lista de productos de ejemplo
const SAMPLE_PRODUCTS = [
  { id: 1, producto: "Zapatillas Deportivas Premium", cantidad: 3, demanda: "alta", categoria: "deportivo" },
  { id: 2, producto: "Mocasines Elegance", cantidad: 0, demanda: "media", categoria: "formal" },
  { id: 3, producto: "Botas de Cuero Importadas", cantidad: 8, demanda: "alta", categoria: "casual" },
  { id: 4, producto: "Zapatos Formales Modelo Ejecutivo", cantidad: 12, demanda: "baja", categoria: "formal" },
  { id: 5, producto: "Sandalias de Playa Tropical", cantidad: 22, demanda: "alta", categoria: "playa" },
  { id: 6, producto: "Tenis Urbanos Street Style", cantidad: 4, demanda: "alta", categoria: "casual" },
  { id: 7, producto: "Botines Chelsea Premium", cantidad: 7, demanda: "media", categoria: "casual" },
  { id: 8, producto: "Zapatos Náuticos Marinero", cantidad: 9, demanda: "baja", categoria: "casual" },
  { id: 9, producto: "Zapatillas Running Pro", cantidad: 0, demanda: "alta", categoria: "deportivo" },
  { id: 10, producto: "Alpargatas Verano Essential", cantidad: 15, demanda: "media", categoria: "playa" },
  { id: 11, producto: "Pantuflas Comfort Home", cantidad: 11, demanda: "baja", categoria: "hogar" },
  { id: 12, producto: "Zapatillas Skate Extreme", cantidad: 5, demanda: "alta", categoria: "deportivo" },
  { id: 13, producto: "Zapatos Oxford Classic", cantidad: 2, demanda: "media", categoria: "formal" },
  { id: 14, producto: "Sandalias Outdoor Adventure", cantidad: 18, demanda: "alta", categoria: "deportivo" },
  { id: 15, producto: "Botas de Lluvia Waterproof", cantidad: 7, demanda: "baja", categoria: "casual" },
];

// Datos de envíos de ejemplo
const SAMPLE_SHIPMENTS = [
  { id: 101, producto: "Zapatillas Deportivas Premium", fecha: "2025-02-15", estado: "retrasado", destino: "Tienda Norte" },
  { id: 102, producto: "Mocasines Elegance", fecha: "2025-02-16", estado: "pendiente", destino: "Tienda Centro" },
  { id: 103, producto: "Botas de Cuero Importadas", fecha: "2025-02-14", estado: "retrasado", destino: "Tienda Sur" },
];

export default function Alertas() {
  const { isDarkMode } = useUI5Theme();
  const [allAlerts, setAllAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Generar alertas basadas en datos
  useEffect(() => {
    const generateAlerts = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const newAlerts = [];
        let alertId = 1;
        
        // Generar alertas de stock
        SAMPLE_PRODUCTS.forEach(product => {
          if (product.cantidad === 0) {
            newAlerts.push({
              id: alertId++,
              type: "error",
              status: "Agotado",
              title: `${product.producto} - Sin Stock`,
              details: "0 unidades disponibles en todas las ubicaciones",
              category: "stock",
              timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
              product: product,
              isResolved: false
            });
          } else if (product.cantidad <= STOCK_THRESHOLDS.CRITICAL) {
            newAlerts.push({
              id: alertId++,
              type: "error",
              status: "Crítico",
              title: `${product.producto} - Stock Crítico`,
              details: `Stock actual: ${product.cantidad} unidades (Por debajo del umbral crítico de ${STOCK_THRESHOLDS.CRITICAL})`,
              category: "stock",
              timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
              product: product,
              isResolved: false
            });
          } else if (product.cantidad <= STOCK_THRESHOLDS.WARNING) {
            newAlerts.push({
              id: alertId++,
              type: "warning",
              status: "Bajo Stock",
              title: `${product.producto} - Stock Bajo`,
              details: `Stock actual: ${product.cantidad} unidades (Por debajo del umbral de advertencia de ${STOCK_THRESHOLDS.WARNING})`,
              category: "stock",
              timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
              product: product,
              isResolved: false
            });
          }
        });
        
        // Generar alertas de demanda
        SAMPLE_PRODUCTS.filter(p => p.demanda === "alta" && p.cantidad > 0 && p.cantidad < 20).forEach(product => {
          newAlerts.push({
            id: alertId++,
            type: "warning",
            status: "Alta Demanda",
            title: `${product.producto} - Alta Demanda`,
            details: `Stock actual: ${product.cantidad} unidades. Considere aumentar el inventario debido a la alta demanda.`,
            category: "demand",
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            product: product,
            isResolved: false
          });
        });
        
        // Generar alertas de envíos
        SAMPLE_SHIPMENTS.filter(s => s.estado === "retrasado").forEach(shipment => {
          newAlerts.push({
            id: alertId++,
            type: "warning",
            status: "Envío Retrasado",
            title: `${shipment.producto} - Envío Retrasado`,
            details: `Envío con destino a ${shipment.destino} programado para ${new Date(shipment.fecha).toLocaleDateString()} se encuentra retrasado.`,
            category: "shipping",
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            shipment: shipment,
            isResolved: false
          });
        });
        
        // Agregar algunas alertas resueltas para ejemplo
        for (let i = 0; i < 3; i++) {
          if (i < SAMPLE_PRODUCTS.length) {
            const product = SAMPLE_PRODUCTS[i];
            newAlerts.push({
              id: alertId++,
              type: "success",
              status: "Resuelto",
              title: `${product.producto} - Stock Normalizado`,
              details: `El nivel de stock ha sido normalizado a ${product.cantidad + 20} unidades.`,
              category: "stock",
              timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
              product: product,
              isResolved: true,
              resolvedAt: new Date(Date.now() - Math.random() * 43200000).toISOString()
            });
          }
        }
        
        // Ordenar alertas
        newAlerts.sort((a, b) => {
          if (a.isResolved !== b.isResolved) {
            return a.isResolved ? 1 : -1;
          }
          const typePriority = { error: 0, warning: 1, success: 2 };
          if (typePriority[a.type] !== typePriority[b.type]) {
            return typePriority[a.type] - typePriority[b.type];
          }
          return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        setAllAlerts(newAlerts);
        setIsLoading(false);
      }, 1000);
    };
    
    generateAlerts();
    
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, UPDATE_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [refreshTrigger]);

  // Filtrar alertas
  useEffect(() => {
    let filtered = [...allAlerts];
    
    if (selectedFilter !== "all") {
      filtered = filtered.filter(alert => {
        if (selectedFilter === "success") {
          return alert.isResolved;
        } else {
          return alert.type === selectedFilter && !alert.isResolved;
        }
      });
    }
    
    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [allAlerts, selectedFilter]);

  // Obtener alertas para la página actual
  const currentAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * ALERTS_PER_PAGE;
    return filteredAlerts.slice(startIndex, startIndex + ALERTS_PER_PAGE);
  }, [filteredAlerts, currentPage]);

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredAlerts.length / ALERTS_PER_PAGE);

  // Manejadores de eventos
  const handlePageChange = (event) => {
    setCurrentPage(event.detail.page);
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
  };

  const handleResolveAlert = (alertId) => {
    setAllAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId 
          ? { 
              ...alert, 
              isResolved: true, 
              type: "success", 
              status: "Resuelto", 
              resolvedAt: new Date().toISOString() 
            } 
          : alert
      )
    );
    setIsDetailDialogOpen(false);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Funciones auxiliares
  const getValueState = (type) => {
    switch (type) {
      case "error": return ValueState.Error;
      case "warning": return ValueState.Warning;
      case "success": return ValueState.Success;
      default: return ValueState.Information;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "stock": return "inventory";
      case "demand": return "line-chart";
      case "shipping": return "shipping-status";
      default: return "check-availability";
    }
  };

  return (
    <div style={styles.mainContent}>
      <AlertHeader />
      
      <AlertFilters
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onRefresh={handleRefresh}
      />

      <div style={styles.alertList}>
        <AlertList
          alerts={currentAlerts}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onAlertClick={handleAlertClick}
          getValueState={getValueState}
          getCategoryIcon={getCategoryIcon}
        />
      </div>

      <AlertDetailDialog
        alert={selectedAlert}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onResolve={handleResolveAlert}
        getValueState={getValueState}
      />
    </div>
  );
} 