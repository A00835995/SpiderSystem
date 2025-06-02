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
    indicadoresCliente,
    resumenInventario,
    stockPorCategoria,
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
    // Si no hay datos de la API, usar valores por defecto
    if (!resumenFinanciero && !indicadoresCliente && !resumenInventario) {
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
        clientesNuevos: {
          valor: 0,
          cambio: 0,
          diaMasVentas: 'No disponible'
        },
        ventaPromedio: {
          valor: 0,
          cambio: 0,
          productosPorVenta: 0
        },
        // Datos de inventario por defecto
        stockTotal: {
          valor: 0,
          cambio: 0,
          productosUnicos: 0
        },
        stockCritico: {
          valor: 0,
          cambio: 0,
          productosAfectados: 0
        },
        rotacionStock: {
          valor: 0,
          cambio: 0,
          diasPromedio: 0
        },
        devoluciones: {
          valor: 0,
          cambio: 0,
          unidades: 0
        },
        stockPorCategoria: [],
        ventasPorCategoria: []
      };
    }

    // Determinar qué datos de stock por categoría usar
    const stockCategoriaData = resumenInventario?.stockPorCategoria || stockPorCategoria || [];

    // Transformar datos de inventario de la API
    const datosInventario = resumenInventario ? {
      stockTotal: {
        valor: resumenInventario.resumenGeneral?.stockTotal || 0,
        cambio: 5.1, // Temporalmente estático hasta que se agregue al SP
        productosUnicos: resumenInventario.resumenGeneral?.productosUnicos || 0
      },
      stockCritico: {
        valor: resumenInventario.resumenGeneral?.productosBajoStock || 0,
        cambio: 21.6, // Temporalmente estático hasta que se agregue al SP
        productosAfectados: resumenInventario.resumenGeneral?.unidadesBajoStock || 0
      },
      rotacionStock: {
        valor: 3.2, // Temporalmente estático hasta que se agregue al SP
        cambio: 10.3, // Temporalmente estático hasta que se agregue al SP
        diasPromedio: 92 // Temporalmente estático hasta que se agregue al SP
      },
      devoluciones: {
        valor: 2.4, // Temporalmente estático hasta que se agregue al SP
        cambio: -17.2, // Temporalmente estático hasta que se agregue al SP
        unidades: 298 // Temporalmente estático hasta que se agregue al SP
      },
      stockPorCategoria: Array.isArray(stockCategoriaData) ? stockCategoriaData : []
    } : {
      stockTotal: { valor: 0, cambio: 0, productosUnicos: 0 },
      stockCritico: { valor: 0, cambio: 0, productosAfectados: 0 },
      rotacionStock: { valor: 0, cambio: 0, diasPromedio: 0 },
      devoluciones: { valor: 0, cambio: 0, unidades: 0 },
      stockPorCategoria: []
    };

    // Transformar datos de métricas financieras
    return {
      ventasTotales: {
        valor: resumenFinanciero?.ventasTotales?.valor || 0,
        cambio: resumenFinanciero?.ventasTotales?.cambio || 0,
        modeloMasVendido: resumenFinanciero?.ventasTotales?.modeloMasVendido || "N/A"
      },
      ganancias: {
        valor: resumenFinanciero?.ganancias?.valor || 0,
        cambio: resumenFinanciero?.ganancias?.cambio || 0,
        margenPromedio: resumenFinanciero?.ganancias?.margenPromedio || 0
      },
      clientesNuevos: {
        valor: indicadoresCliente?.clientesNuevos?.valor || 0,
        cambio: indicadoresCliente?.clientesNuevos?.cambio || 0,
        diaMasVentas: indicadoresCliente?.clientesNuevos?.diaMasVentas || 'No disponible'
      },
      ventaPromedio: {
        valor: indicadoresCliente?.ventaPromedio?.valor || 0,
        cambio: indicadoresCliente?.ventaPromedio?.cambio || 0,
        productosPorVenta: indicadoresCliente?.ventaPromedio?.productosPorVenta || 0
      },
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
          <AnalysisSection metrics={metricsData} vista={vista} periodo={periodo} />
        </>
      )}
    </div>
  );
};

export default Metricas; 