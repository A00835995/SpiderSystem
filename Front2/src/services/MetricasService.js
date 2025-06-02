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

// Obtener indicadores de cliente mensual
export async function fetchIndicadoresClienteMes(mes, anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/indicadores-cliente/mes/${mes}/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener indicadores de cliente mensual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener indicadores de cliente anual
export async function fetchIndicadoresClienteAnio(anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/indicadores-cliente/anio/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener indicadores de cliente anual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener indicadores completos mensual (NUEVO)
export async function fetchIndicadoresCompletosMes(mes, anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/indicadores-completos/mes/${mes}/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener indicadores completos mensual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener indicadores completos anual (NUEVO)
export async function fetchIndicadoresCompletosAnio(anio) {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/indicadores-completos/anio/${anio}`);
  if (!response.ok) {
    throw new Error(`Error al obtener indicadores completos anual: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
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
    throw new Error(`Error al obtener métricas completas: ${error.message}`);
  }
}

// Obtener resumen de inventario completo
export async function fetchResumenInventarioCompleto() {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/resumen-inventario-completo`);
  if (!response.ok) {
    throw new Error(`Error al obtener resumen de inventario completo: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}

// Obtener stock por categoría
export async function fetchStockPorCategoria() {
  const response = await fetch(`${API_CONFIG.baseUrl}/metricas/stock-por-categoria`);
  if (!response.ok) {
    throw new Error(`Error al obtener stock por categoría: ${response.statusText}`);
  }
  const json = await response.json();
  return json;
}
