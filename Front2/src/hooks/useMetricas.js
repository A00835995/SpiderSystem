import { useState, useEffect, useCallback } from 'react';
import { 
  fetchResumenFinancieroMes,
  fetchResumenFinancieroAnio,
  fetchVentasPorCategoriaMes,
  fetchVentasPorCategoriaAnio,
  fetchMetricasCompletas
} from '../services/MetricasService';

/**
 * Hook personalizado para gestionar las operaciones de métricas
 * @returns {Object} Estado y funciones para administrar métricas
 */
export function useMetricas() {
  const [resumenFinanciero, setResumenFinanciero] = useState(null);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [periodoActual, setPeriodoActual] = useState({
    tipo: 'mensual', // 'mensual' o 'anual'
    mes: new Date().getMonth() + 1,
    anio: new Date().getFullYear()
  });

  /**
   * Obtiene resumen financiero mensual
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   * @returns {Promise<Object>} Datos del resumen financiero
   */
  const obtenerResumenFinancieroMes = useCallback(async (mes, anio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchResumenFinancieroMes(mes, anio);
      const data = response.data || response; // Extraer data si existe, sino usar respuesta completa
      setResumenFinanciero(data);
      return data;
    } catch (err) {
      setError('Error al obtener resumen financiero mensual: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene resumen financiero anual
   * @param {number} anio - Año
   * @returns {Promise<Object>} Datos del resumen financiero
   */
  const obtenerResumenFinancieroAnio = useCallback(async (anio) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchResumenFinancieroAnio(anio);
      const data = response.data || response; // Extraer data si existe, sino usar respuesta completa
      setResumenFinanciero(data);
      return data;
    } catch (err) {
      setError('Error al obtener resumen financiero anual: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
   * Obtiene todas las métricas para un período específico
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
      
      // Extraer datos correctamente de las respuestas
      const resumenData = data.resumenFinanciero?.data || data.resumenFinanciero;
      const ventasData = data.ventasPorCategoria?.data || data.ventasPorCategoria;
      
      // Actualizar estados
      setResumenFinanciero(resumenData);
      setVentasPorCategoria(Array.isArray(ventasData) ? ventasData : []);
      setPeriodoActual({
        tipo: periodo,
        mes: mes,
        anio: anio
      });
      
      return {
        resumenFinanciero: resumenData,
        ventasPorCategoria: ventasData
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
      await obtenerMetricasCompletas(tipoPeriodo, mes, anio);
    } catch (err) {
      console.error('Error al cambiar período:', err);
    }
  }, [obtenerMetricasCompletas]);

  /**
   * Recarga las métricas del período actual
   */
  const recargarMetricas = useCallback(async () => {
    try {
      const { tipo, mes, anio } = periodoActual;
      await obtenerMetricasCompletas(tipo, mes, anio);
    } catch (err) {
      console.error('Error al recargar métricas:', err);
    }
  }, [periodoActual, obtenerMetricasCompletas]);

  /**
   * Limpia los datos y errores
   */
  const limpiarDatos = useCallback(() => {
    setResumenFinanciero(null);
    setVentasPorCategoria([]);
    setError(null);
  }, []);

  // Cargar métricas iniciales al montar el componente
  useEffect(() => {
    const { tipo, mes, anio } = periodoActual;
    obtenerMetricasCompletas(tipo, mes, anio);
  }, []); // Solo se ejecuta al montar

  return {
    // Estados
    resumenFinanciero,
    ventasPorCategoria,
    loading,
    error,
    periodoActual,
    
    // Funciones individuales
    obtenerResumenFinancieroMes,
    obtenerResumenFinancieroAnio,
    obtenerVentasPorCategoriaMes,
    obtenerVentasPorCategoriaAnio,
    
    // Funciones combinadas
    obtenerMetricasCompletas,
    cambiarPeriodo,
    recargarMetricas,
    
    // Utilidades
    limpiarDatos
  };
} 