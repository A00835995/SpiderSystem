import React, { useState, useEffect, useMemo } from "react";
import { ValueState } from "@ui5/webcomponents-react";

import { styles } from "../Styles/AlertasStyle";
import { fetchAlertas } from "../services/AlertasService";

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

const ALERTS_PER_PAGE = 10;

export default function Alertas() {

  const [allAlerts, setAllAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Obtener alertas desde el API
  useEffect(() => {
    const getAlertasFromAPI = async () => {
      setIsLoading(true);
      try {
        // Limpiar las alertas existentes antes de cargar las nuevas
        setAllAlerts([]);
        
        const response = await fetchAlertas();
        
        if (response && response.data) {
          // Mapear datos del API al formato esperado por la UI
          const mappedAlerts = response.data.map(alert => {
            // Determinar el tipo de alerta basado en el estado
            let type = "information";
            if (alert.estado === "Bajo stock") {
              type = "warning";
            } else if (alert.estado === "Agotado") {
              type = "error";
            } else if (alert.estado === "Disponible") {
              type = "success";
            }
            
            // Verificar si la alerta está resuelta
            const isResolved = alert.fecha_resolucion === true;
            
            return {
              id: alert.id,
              type: type,
              status: alert.estado,
              title: `${alert.nombre} - ${alert.estado}`,
              details: alert.mensaje,
              category: "stock", 
              timestamp: alert.fecha_creacion,
              product: {
                id: alert.id,
                producto: alert.nombre,
                cantidad: alert.existencia
              },
              isResolved: isResolved,
              resolvedAt: isResolved ? alert.resuelto : null
            };
          });
          
          // Ordenar alertas
          mappedAlerts.sort((a, b) => {
            if (a.isResolved !== b.isResolved) {
              return a.isResolved ? 1 : -1;
            }
            const typePriority = { error: 0, warning: 1, success: 2, information: 3 };
            if (typePriority[a.type] !== typePriority[b.type]) {
              return typePriority[a.type] - typePriority[b.type];
            }
            return new Date(b.timestamp) - new Date(a.timestamp);
          });
          
          // Reemplazar completamente las alertas existentes
          setAllAlerts(mappedAlerts);
        }
      } catch (error) {
        console.error("Error al obtener alertas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getAlertasFromAPI();
  }, [refreshTrigger]);
  
  // Filtrar alertas
  useEffect(() => {
    // Siempre empezar con una copia limpia de todas las alertas
    let filtered = [...allAlerts];
    
    if (selectedFilter !== "all") {
      filtered = allAlerts.filter(alert => {
        if (selectedFilter === "success") {
          return alert.isResolved;
        } else {
          return alert.type === selectedFilter && !alert.isResolved;
        }
      });
    }
    
    // Limpiar las alertas filtradas antes de establecer las nuevas
    setFilteredAlerts([]);
    // Luego establecer las alertas filtradas
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

  const handleFilterChange = (newFilter) => {
    // Limpiar las alertas filtradas antes de cambiar el filtro
    setFilteredAlerts([]);
    setSelectedFilter(newFilter);
    setCurrentPage(1);
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    setIsDetailDialogOpen(true);
  };
  const handleRefresh = () => {
    // Forzar actualización desde la API
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
        onFilterChange={handleFilterChange}
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
        getValueState={getValueState}
      />
    </div>
  );
}