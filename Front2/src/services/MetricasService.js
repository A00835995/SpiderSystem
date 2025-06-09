import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

/**
 * Servicio para gestionar las operaciones de métricas
 */

// Obtener ventas por categoría mensual
export async function fetchVentasPorCategoriaMes(mes, anio) {
  try {
    const response = await axiosInstance.get(`/metricas/ventas-categoria/mes/${mes}/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener ventas por categoría mensual:', error);
    throw new Error(`Error al obtener ventas por categoría mensual: ${error.message}`);
  }
}

// Obtener ventas por categoría anual
export async function fetchVentasPorCategoriaAnio(anio) {
  try {
    const response = await axiosInstance.get(`/metricas/ventas-categoria/anio/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener ventas por categoría anual:', error);
    throw new Error(`Error al obtener ventas por categoría anual: ${error.message}`);
  }
}

// Obtener indicadores completos mensual (NUEVO)
export async function fetchIndicadoresCompletosMes(mes, anio) {
  try {
    const response = await axiosInstance.get(`/metricas/indicadores-completos/mes/${mes}/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener indicadores completos mensual:', error);
    throw new Error(`Error al obtener indicadores completos mensual: ${error.message}`);
  }
}

// Obtener indicadores completos anual (NUEVO)
export async function fetchIndicadoresCompletosAnio(anio) {
  try {
    const response = await axiosInstance.get(`/metricas/indicadores-completos/anio/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener indicadores completos anual:', error);
    throw new Error(`Error al obtener indicadores completos anual: ${error.message}`);
  }
}

// Función helper para obtener métricas completas según el período
export async function fetchMetricasCompletas(periodo, mes = null, anio = null) {
  try {
    let indicadoresCompletos, ventasPorCategoria;

    if (periodo === 'mensual' && mes && anio) {
      [indicadoresCompletos, ventasPorCategoria] = await Promise.all([
        fetchIndicadoresCompletosMes(mes, anio),
        fetchVentasPorCategoriaMes(mes, anio)
      ]);
    } else if (periodo === 'anual' && anio) {
      [indicadoresCompletos, ventasPorCategoria] = await Promise.all([
        fetchIndicadoresCompletosAnio(anio),
        fetchVentasPorCategoriaAnio(anio)
      ]);
    } else {
      throw new Error('Parámetros inválidos para obtener métricas completas');
    }

    return {
      indicadoresCompletos,
      ventasPorCategoria,
      periodo,
      mes,
      anio
    };
  } catch (error) {
    console.error('Error al obtener métricas completas:', error);
    throw new Error(`Error al obtener métricas completas: ${error.message}`);
  }
}

// Obtener resumen de inventario completo
export async function fetchResumenInventarioCompleto() {
  try {
    const response = await axiosInstance.get('/metricas/resumen-inventario-completo');
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen de inventario completo:', error);
    throw new Error(`Error al obtener resumen de inventario completo: ${error.message}`);
  }
}

// Obtener stock por categoría
export async function fetchStockPorCategoria() {
  try {
    const response = await axiosInstance.get('/metricas/stock-por-categoria');
    return response.data;
  } catch (error) {
    console.error('Error al obtener stock por categoría:', error);
    throw new Error(`Error al obtener stock por categoría: ${error.message}`);
  }
}
