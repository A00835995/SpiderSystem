import { API_CONFIG } from '../config/api';

/**
 * Servicio para gestionar las operaciones de métricas
 */

// Obtener resumen financiero mensual
export async function fetchResumenFinancieroMes(mes, anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/resumen-financiero/mes/${mes}/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener resumen financiero mensual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener resumen financiero anual
export async function fetchResumenFinancieroAnio(anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/resumen-financiero/anio/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener resumen financiero anual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener ventas por categoría mensual
export async function fetchVentasPorCategoriaMes(mes, anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/ventas-categoria/mes/${mes}/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener ventas por categoría mensual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener ventas por categoría anual
export async function fetchVentasPorCategoriaAnio(anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/ventas-categoria/anio/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener ventas por categoría anual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Función helper para obtener métricas completas según el período
export async function fetchMetricasCompletas(periodo, mes = null, anio = null) {
  try {
    let resumenFinanciero, ventasPorCategoria;

    if (periodo === 'mensual' && mes && anio) {
      [resumenFinanciero, ventasPorCategoria] = await Promise.all([
        fetchResumenFinancieroMes(mes, anio),
        fetchVentasPorCategoriaMes(mes, anio)
      ]);
    } else if (periodo === 'anual' && anio) {
      [resumenFinanciero, ventasPorCategoria] = await Promise.all([
        fetchResumenFinancieroAnio(anio),
        fetchVentasPorCategoriaAnio(anio)
      ]);
    } else {
      throw new Error('Parámetros inválidos para obtener métricas completas');
    }

    return {
      resumenFinanciero,
      ventasPorCategoria,
      periodo,
      mes,
      anio
    };
  } catch (error) {
    throw new Error(`Error al obtener métricas completas: ${error.message}`);
  }
}
