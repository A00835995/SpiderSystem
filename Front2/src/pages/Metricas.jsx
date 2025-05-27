import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Importar componentes refactorizados
import MetricasHeader from '../components/Metricas/MetricasHeader';
import MetricasFilters from '../components/Metricas/MetricasFilters';
import MetricasLoading from '../components/Metricas/MetricasLoading';
import KPIGrid from '../components/Metricas/KPIGrid';
import AnalysisSection from '../components/Metricas/AnalysisSection';

const Metricas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mesActual");
  const [vista, setVista] = useState("general");
  const [metrics, setMetrics] = useState({
    ventasTotales: {
      valor: 1254780,
      cambio: 8.5,
      modeloMasVendido: "Zapatillas Runner Pro"
    },
    ganancias: {
      valor: 376434,
      cambio: 12.3,
      margenPromedio: 30.0
    },
    clientesNuevos: {
      valor: 842,
      cambio: 5.5,
      tasaConversion: 4.8
    },
    ticketPromedio: {
      valor: 85.40,
      cambio: -2.1,
      productosPorVenta: 1.8
    },
    ventasPorCategoria: [
      {
        categoria: "Calzado Deportivo",
        porcentaje: "42%",
        valor: 425640,
        ranking: 1
      },
      {
        categoria: "Calzado Casual",
        porcentaje: "33%",
        valor: 338790,
        ranking: 2
      },
      {
        categoria: "Calzado Formal",
        porcentaje: "25%",
        valor: 287320,
        ranking: 3
      }
    ],
    distribucionVentas: {
      total: 14680,
      canales: [
        {
          nombre: "Tienda Física",
          ventas: 9102,
          valor: "MXN $778.0k"
        },
        {
          nombre: "Online",
          ventas: 4110,
          valor: "MXN $351.3k"
        },
        {
          nombre: "Mayoristas",
          ventas: 1468,
          valor: "MXN $125.5k"
        }
      ]
    }
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleExport = () => {
    console.log('Exportando métricas...');
  };

  return (
    <div style={{ 
      width: "100%",
      minHeight: "100%",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      paddingTop: "2rem"
    }}>
      {/* Header */}
      <MetricasHeader />

      {/* Filtros */}
      <MetricasFilters 
        periodo={periodo}
        setPeriodo={setPeriodo}
        vista={vista}
        setVista={setVista}
      />

      {/* Contenido principal */}
      {loading ? (
        <MetricasLoading />
      ) : (
        <>
          {/* KPIs Grid */}
          <KPIGrid metrics={metrics} />

          {/* Sección de Análisis */}
          <AnalysisSection metrics={metrics} />
        </>
      )}
    </div>
  );
};

export default Metricas; 