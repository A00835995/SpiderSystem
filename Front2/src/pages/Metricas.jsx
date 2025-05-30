import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

// Importar componentes refactorizados
import MetricasHeader from '../components/Metricas/MetricasHeader';
import MetricasFilters from '../components/Metricas/MetricasFilters';
import MetricasLoading from '../components/Metricas/MetricasLoading';
import KPIGrid from '../components/Metricas/KPIGrid';
import AnalysisSection from '../components/Metricas/AnalysisSection';

// Importar hook de métricas
import { useMetricas } from '../hooks/useMetricas';

const Metricas = () => {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState("mesActual");
  const [vista, setVista] = useState("general");
  
  // Hook de métricas
  const {
    resumenFinanciero,
    ventasPorCategoria,
    loading,
    error,
    cambiarPeriodo
  } = useMetricas();

  // Función para obtener fecha actual y calcular períodos
  const obtenerParametrosPeriodo = (tipoPeriodo) => {
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1; // getMonth() devuelve 0-11
    const anioActual = ahora.getFullYear();
    
    switch (tipoPeriodo) {
      case 'mesActual':
        return { tipo: 'mensual', mes: mesActual, anio: anioActual };
      case 'mesAnterior':
        const mesAnterior = mesActual === 1 ? 12 : mesActual - 1;
        const anioMesAnterior = mesActual === 1 ? anioActual - 1 : anioActual;
        return { tipo: 'mensual', mes: mesAnterior, anio: anioMesAnterior };
      case 'anioActual':
        return { tipo: 'anual', mes: null, anio: anioActual };
      case 'anioAnterior':
        return { tipo: 'anual', mes: null, anio: anioActual - 1 };
      default:
        return { tipo: 'mensual', mes: mesActual, anio: anioActual };
    }
  };

  // Efecto para cambiar período cuando se actualiza el filtro
  useEffect(() => {
    const parametros = obtenerParametrosPeriodo(periodo);
    cambiarPeriodo(parametros.tipo, parametros.mes, parametros.anio);
  }, [periodo, cambiarPeriodo]);

  // Función para transformar datos de la API al formato esperado por los componentes
  const transformarDatosParaComponentes = () => {
    // Datos por defecto para clientes nuevos y ticket promedio (temporalmente)
    const datosEstaticos = {
      clientesNuevos: {
        valor: 0,
        cambio: 0,
        tasaConversion: 0
      },
      ticketPromedio: {
        valor: 0,
        cambio: 0,
        productosPorVenta: 0
      }
    };

    // Datos estáticos para inventario (temporalmente)
    const datosInventario = {
      stockTotal: {
        valor: 12450,
        cambio: 5.1,
        productosUnicos: 842
      },
      stockCritico: {
        valor: 45,
        cambio: 21.6,
        productosAfectados: 12
      },
      rotacionStock: {
        valor: 3.2,
        cambio: 10.3,
        diasPromedio: 92
      },
      devoluciones: {
        valor: 2.4,
        cambio: -17.2,
        unidades: 298
      },
      stockPorCategoria: [
        {
          categoria: "Calzado Deportivo",
          unidades: 5602,
          productos: 380,
          color: "#28a745"
        },
        {
          categoria: "Calzado Casual",
          unidades: 3735,
          productos: 252,
          color: "#007bff"
        },
        {
          categoria: "Calzado Formal",
          unidades: 1867,
          productos: 126,
          color: "#6f42c1"
        },
        {
          categoria: "Accesorios",
          unidades: 1246,
          productos: 84,
          color: "#6c757d"
        }
      ]
    };

    // Si no hay datos de la API, usar valores por defecto
    if (!resumenFinanciero) {
      return {
        ventasTotales: {
          valor: 0,
          cambio: 0,
          modeloMasVendido: "N/A"
        },
        ganancias: {
          valor: 0,
          cambio: 0,
          margenPromedio: 0
        },
        ...datosEstaticos,
        ...datosInventario,
        ventasPorCategoria: ventasPorCategoria || []
      };
    }

    // Transformar datos de la API
    return {
      ventasTotales: {
        valor: resumenFinanciero.ventasTotales?.valor || 0,
        cambio: resumenFinanciero.ventasTotales?.cambio || 0,
        modeloMasVendido: resumenFinanciero.ventasTotales?.modeloMasVendido || "N/A"
      },
      ganancias: {
        valor: resumenFinanciero.ganancias?.valor || 0,
        cambio: resumenFinanciero.ganancias?.cambio || 0,
        margenPromedio: resumenFinanciero.ganancias?.margenPromedio || 0
      },
      ...datosEstaticos,
      ...datosInventario,
      ventasPorCategoria: Array.isArray(ventasPorCategoria) ? ventasPorCategoria : []
    };
  };

  const handleExport = () => {
    console.log('Exportando métricas...');
  };

  // Mostrar error si existe
  if (error) {
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
        <MetricasHeader />
        <div style={{
          padding: "2rem",
          backgroundColor: "var(--sapErrorBackground)",
          borderRadius: "0.5rem",
          color: "var(--sapErrorColor)",
          textAlign: "center"
        }}>
          <h3>Error al cargar métricas</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const metricsData = transformarDatosParaComponentes();

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
          <KPIGrid metrics={metricsData} vista={vista} />

          {/* Sección de Análisis */}
          <AnalysisSection metrics={metricsData} vista={vista} />
        </>
      )}
    </div>
  );
};

export default Metricas; 