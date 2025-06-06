import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

/**
 * Obtiene las órdenes pendientes para el dashboard
 * @returns {Promise<Array>} Datos de órdenes pendientes
 */
export async function fetchOrdenesPendientes() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ordenesPendientes);
    return [{ ordenesPendientes: response.data.data.total }];
  } catch (error) {
    console.error('Error obteniendo órdenes pendientes:', error);
    throw new Error('Error obteniendo órdenes pendientes');
  }
}

/**
 * Obtiene las ventas del mes actual
 * @returns {Promise<Array>} Datos de ventas del mes
 */
export async function fetchVentasMes() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ventasMes);
    const data = response.data.data;
    
    if (Array.isArray(data)) {
      return data.map(item => ({
        mes: item.mes,
        ano: item.ano,
        total: item.total
      }));
    } else if (data && typeof data === 'object') {
      return [{
        mes: data.mes,
        ano: data.ano,
        total: data.total
      }];
    } else {
      return [{ mes: null, ano: null, total: 0 }];
    }
  } catch (error) {
    console.error('Error obteniendo ventas del mes:', error);
    throw new Error('Error obteniendo ventas del mes');
  }
}

/**
 * Obtiene información de productos en inventario
 * @returns {Promise<Array>} Datos de productos en inventario
 */
export async function fetchProductosInventario() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.productosInventario);
    return [{ total: response.data.data.total }];
  } catch (error) {
    console.error('Error obteniendo productos en inventario:', error);
    throw new Error('Error obteniendo productos en inventario');
  }
}

/**
 * Obtiene porcentaje de ventas respecto al mes anterior
 * @returns {Promise<Array>} Datos de comparación con mes anterior
 */
export async function fetchVentasMesAnterior() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ventasMesAnterior);
    return [{ porcentaje: response.data.data.porcentaje }];
  } catch (error) {
    console.error('Error obteniendo ventas del mes anterior:', error);
    throw new Error('Error obteniendo ventas del mes anterior');
  }
}

/**
 * Obtiene las órdenes recientes
 * @returns {Promise<Array>} Lista de órdenes recientes
 */
export async function fetchOrdenesRecientes() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ordenesRecientes);
    return response.data.data.map(item => ({
      numeroOrden: item.numeroOrden,
      numeroProveedor: item.numeroProveedor,
      fecha: item.fecha,
      cantidad: item.cantidad,
      productos: item.productos,
      estado: item.estado,
      total: item.total
    }));
  } catch (error) {
    console.error('Error obteniendo órdenes recientes:', error);
    throw new Error('Error obteniendo órdenes recientes');
  }
}

/**
 * Obtiene ventas por categoría
 * @returns {Promise<Array>} Datos de ventas por categoría
 */
export async function fetchVentasXCategoria() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ventasXCategoria);
    return response.data.data.map(item => ({
      categoria: item.categoria,
      total: item.total,
      porcentaje: item.porcentaje
    }));
  } catch (error) {
    console.error('Error obteniendo ventas por categoría:', error);
    throw new Error('Error obteniendo ventas por categoría');
  }
}

/**
 * Obtiene los productos más vendidos del mes actual
 * @returns {Promise<Array>} Lista de productos más vendidos
 */
export async function fetchProductosMasVendidosMesActual() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.productosMasVendidosMesActual);
    return response.data.data.map(item => ({
      idProducto: item.idProducto,
      nombre: item.nombre,
      precio: item.precio,
      existencia: item.existencia,
      estado: item.estado,
      total: item.total
    }));
  } catch (error) {
    console.error('Error obteniendo productos más vendidos:', error);
    throw new Error('Error obteniendo productos más vendidos');
  }
}