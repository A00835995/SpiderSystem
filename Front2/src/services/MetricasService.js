import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

/**
 * Servicio para gestionar las operaciones de métricas
 */

// Obtener resumen financiero mensual
export async function fetchResumenFinancieroMes(mes, anio) {
  try {
    const response = await axiosInstance.get(`/metricas/resumen-financiero/mes/${mes}/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen financiero mensual:', error);
    throw new Error(`Error al obtener resumen financiero mensual: ${error.message}`);
  }
}

// Obtener resumen financiero anual
export async function fetchResumenFinancieroAnio(anio) {
  try {
    const response = await axiosInstance.get(`/metricas/resumen-financiero/anio/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen financiero anual:', error);
    throw new Error(`Error al obtener resumen financiero anual: ${error.message}`);
  }
}

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

// Obtener indicadores de cliente mensual
export async function fetchIndicadoresClienteMes(mes, anio) {
  try {
    const response = await axiosInstance.get(`/metricas/indicadores-cliente/mes/${mes}/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener indicadores de cliente mensual:', error);
    throw new Error(`Error al obtener indicadores de cliente mensual: ${error.message}`);
  }
}

// Obtener indicadores de cliente anual
export async function fetchIndicadoresClienteAnio(anio) {
  try {
    const response = await axiosInstance.get(`/metricas/indicadores-cliente/anio/${anio}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener indicadores de cliente anual:', error);
    throw new Error(`Error al obtener indicadores de cliente anual: ${error.message}`);
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

    // Crear datos simulados para indicadores de cliente mientras se implementan los SP
    const indicadoresCliente = {
      data: {
        clientesNuevos: {
          valor: Math.floor(Math.random() * 100) + 50, // Simulado: 50-150 clientes
          cambio: (Math.random() - 0.5) * 40, // Simulado: variación ±20%
          tasaConversion: Math.random() * 10 + 5 // Simulado: 5-15%
        },
        ventaPromedio: {
          valor: Math.random() * 500 + 200, // Simulado: $200-700
          cambio: (Math.random() - 0.5) * 30, // Simulado: variación ±15%
          productosPorVenta: Math.random() * 3 + 1 // Simulado: 1-4 productos
        }
      }
    };

    // Combinar los datos de resumen financiero e indicadores de cliente
    const indicadoresCompletos = {
      data: {
        // Datos financieros del SP RESUMEN_FINANCIERO_MES/ANIO
        ventasTotales: resumenFinanciero.data.ventasTotales,
        ganancias: resumenFinanciero.data.ganancias,
        // Datos de cliente simulados temporalmente
        clientesNuevos: indicadoresCliente.data.clientesNuevos,
        ventaPromedio: indicadoresCliente.data.ventaPromedio
      }
    };

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
