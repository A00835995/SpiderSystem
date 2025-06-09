import { useState, useEffect, useCallback } from 'react';
import { 
  fetchVentasPorCategoriaMes,
  fetchVentasPorCategoriaAnio,
  fetchIndicadoresCompletosMes,
  fetchIndicadoresCompletosAnio,
  fetchMetricasCompletas,
  fetchResumenInventarioCompleto,
  fetchStockPorCategoria
} from '../services/MetricasService';

/**
 * Hook personalizado para gestionar las operaciones de métricas
 * @returns {Object} Estado y funciones para administrar métricas
 */
export function useMetricas() {
  const [resumenFinanciero, setResumenFinanciero] = useState(null);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [indicadoresCliente, setIndicadoresCliente] = useState(null);
  const [resumenInventario, setResumenInventario] = useState(null);
  const [stockPorCategoria, setStockPorCategoria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const [error, setError] = useState(null);
  const [periodoActual, setPeriodoActual] = useState({
    tipo: 'mensual', // 'mensual' o 'anual'
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear()
  });

  /**
   * Obtiene ventas por categoría mensual
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   * @returns {Promise<Array>} Datos de ventas por categoría
   */
  const obtenerVentasPorCategoriaMes = useCallback(async (mes, anio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchVentasPorCategoriaMes(mes, anio);
      const data = response.data || response; // Extraer data si existe, sino usar respuesta completa
      setVentasPorCategoria(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError('Error al obtener ventas por categoría mensual: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene ventas por categoría anual
   * @param {number} anio - Año
   * @returns {Promise<Array>} Datos de ventas por categoría
   */
  const obtenerVentasPorCategoriaAnio = useCallback(async (anio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchVentasPorCategoriaAnio(anio);
      const data = response.data || response; // Extraer data si existe, sino usar respuesta completa
      setVentasPorCategoria(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError('Error al obtener ventas por categoría anual: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene indicadores completos mensual
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   * @returns {Promise<Object>} Datos de indicadores completos
   */
  const obtenerIndicadoresCompletosMes = useCallback(async (mes, anio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchIndicadoresCompletosMes(mes, anio);
      const data = response.data || response; // Extraer data si existe, sino usar respuesta completa
      
      // Los indicadores completos incluyen tanto resumen financiero como indicadores de cliente
      setResumenFinanciero(data);
      setIndicadoresCliente(data);
      return data;
    } catch (err) {
      setError('Error al obtener indicadores completos mensual: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene indicadores completos anual
   * @param {number} anio - Año
   * @returns {Promise<Object>} Datos de indicadores completos
   */
  const obtenerIndicadoresCompletosAnio = useCallback(async (anio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchIndicadoresCompletosAnio(anio);
      const data = response.data || response; // Extraer data si existe, sino usar respuesta completa
      
      // Los indicadores completos incluyen tanto resumen financiero como indicadores de cliente
      setResumenFinanciero(data);
      setIndicadoresCliente(data);
      return data;
    } catch (err) {
      setError('Error al obtener indicadores completos anual: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene resumen de inventario completo
   * @returns {Promise<Object>} Datos del resumen de inventario
   */
  const obtenerResumenInventarioCompleto = useCallback(async () => {
    try {
      setLoadingInventario(true);
      setError(null);
      const response = await fetchResumenInventarioCompleto();
      const data = response.data || response;
      setResumenInventario(data);
      return data;
    } catch (err) {
      setError('Error al obtener resumen de inventario: ' + err.message);
      throw err;
    } finally {
      setLoadingInventario(false);
    }
  }, []);

  /**
   * Obtiene stock por categoría
   * @returns {Promise<Array>} Datos del stock por categoría
   */
  const obtenerStockPorCategoria = useCallback(async () => {
    try {
      setLoadingInventario(true);
      setError(null);
      const response = await fetchStockPorCategoria();
      const data = response.data || response;
      setStockPorCategoria(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError('Error al obtener stock por categoría: ' + err.message);
      throw err;
    } finally {
      setLoadingInventario(false);
    }
  }, []);

  /**
   * Obtiene todas las métricas incluyendo inventario
   * @param {string} periodo - 'mensual' o 'anual'
   * @param {number} mes - Mes (solo para período mensual)
   * @param {number} anio - Año
   * @returns {Promise<Object>} Todas las métricas del período
   */
  const obtenerMetricasCompletasConInventario = useCallback(async (periodo, mes = null, anio = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener métricas financieras y de inventario en paralelo
      const [metricasData, inventarioData] = await Promise.all([
        fetchMetricasCompletas(periodo, mes, anio),
        fetchResumenInventarioCompleto()
      ]);
      
      // Los indicadores completos ahora incluyen todo en una sola respuesta
      const indicadoresData = metricasData.indicadoresCompletos?.data || metricasData.indicadoresCompletos;
      const ventasData = metricasData.ventasPorCategoria?.data || metricasData.ventasPorCategoria;
      const inventarioResponseData = inventarioData.data || inventarioData;
      
      // Actualizar estados
      setResumenFinanciero(indicadoresData);
      setIndicadoresCliente(indicadoresData);
      setVentasPorCategoria(Array.isArray(ventasData) ? ventasData : []);
      setResumenInventario(inventarioResponseData);
      setStockPorCategoria(Array.isArray(inventarioResponseData.stockPorCategoria) ? inventarioResponseData.stockPorCategoria : []);
      setPeriodoActual({
        tipo: periodo,
        mes: mes,
        anio: anio
      });
      
      return {
        resumenFinanciero: indicadoresData,
        ventasPorCategoria: ventasData,
        indicadoresCliente: indicadoresData,
        resumenInventario: inventarioResponseData,
        stockPorCategoria: inventarioResponseData.stockPorCategoria
      };
    } catch (err) {
      setError('Error al obtener métricas completas: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene todas las métricas para un período específico (sin inventario)
   * @param {string} periodo - 'mensual' o 'anual'
   * @param {number} mes - Mes (solo para período mensual)
   * @param {number} anio - Año
   * @returns {Promise<Object>} Todas las métricas del período
   */
  const obtenerMetricasCompletas = useCallback(async (periodo, mes = null, anio = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchMetricasCompletas(periodo, mes, anio);
      
      // Los indicadores completos ahora incluyen todo en una sola respuesta
      const indicadoresData = data.indicadoresCompletos?.data || data.indicadoresCompletos;
      const ventasData = data.ventasPorCategoria?.data || data.ventasPorCategoria;
      
      // Actualizar estados - resumenFinanciero e indicadoresCliente vienen del mismo endpoint
      setResumenFinanciero(indicadoresData);
      setIndicadoresCliente(indicadoresData);
      setVentasPorCategoria(Array.isArray(ventasData) ? ventasData : []);
      setPeriodoActual({
        tipo: periodo,
        mes: mes,
        anio: anio
      });
      
      return {
        resumenFinanciero: indicadoresData,
        ventasPorCategoria: ventasData,
        indicadoresCliente: indicadoresData
      };
    } catch (err) {
      setError('Error al obtener métricas completas: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cambia el período y carga las métricas correspondientes
   * @param {string} tipoPeriodo - 'mensual' o 'anual'
   * @param {number} mes - Mes (opcional, solo para mensual)
   * @param {number} anio - Año
   */
  const cambiarPeriodo = useCallback(async (tipoPeriodo, mes = null, anio = null) => {
    try {
      await obtenerMetricasCompletasConInventario(tipoPeriodo, mes, anio);
    } catch (err) {
      console.error('Error al cambiar período:', err);
    }
  }, [obtenerMetricasCompletasConInventario]);

  /**
   * Recarga las métricas del período actual
   */
  const recargarMetricas = useCallback(async () => {
    try {
      const { tipo, mes, anio } = periodoActual;
      await obtenerMetricasCompletasConInventario(tipo, mes, anio);
    } catch (err) {
      console.error('Error al recargar métricas:', err);
    }
  }, [periodoActual, obtenerMetricasCompletasConInventario]);

  /**
   * Limpia los datos y errores
   */
  const limpiarDatos = useCallback(() => {
    setResumenFinanciero(null);
    setVentasPorCategoria([]);
    setIndicadoresCliente(null);
    setResumenInventario(null);
    setStockPorCategoria([]);
    setError(null);
  }, []);

  // Cargar métricas iniciales al montar el componente
  useEffect(() => {
    const { tipo, mes, anio } = periodoActual;
    obtenerMetricasCompletasConInventario(tipo, mes, anio);
  }, []); // Solo se ejecuta al montar

  return {
    // Estados
    resumenFinanciero,
    ventasPorCategoria,
    indicadoresCliente,
    resumenInventario,
    stockPorCategoria,
    loading,
    loadingInventario,
    error,
    periodoActual,
    
    // Funciones individuales
    obtenerVentasPorCategoriaMes,
    obtenerVentasPorCategoriaAnio,
    obtenerIndicadoresCompletosMes,
    obtenerIndicadoresCompletosAnio,
    obtenerResumenInventarioCompleto,
    obtenerStockPorCategoria,
    
    // Funciones combinadas
    obtenerMetricasCompletas,
    obtenerMetricasCompletasConInventario,
    cambiarPeriodo,
    recargarMetricas,
    
    // Utilidades
    limpiarDatos
  };
} 