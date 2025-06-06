import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

export async function fetchInicioData() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ordenesPendientes);
    return [{ ordenesPendientes: response.data.data.total }];
  } catch (error) {
    console.error('Error fetching inicio data:', error);
    throw new Error('Error fetching inicio data');
  }
}

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
    console.error('Error fetching ventas mes data:', error);
    throw new Error('Error fetching ventas mes data');
  }
}

export async function fetchProductosInventario() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.productosInventario);
    return [{ total: response.data.data.total }];
  } catch (error) {
    console.error('Error fetching productos inventario data:', error);
    throw new Error('Error fetching productos inventario data');
  }
}

export async function fetchVentasMesAnterior() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ventasMesAnterior);
    return [{ porcentaje: response.data.data.porcentaje }];
  } catch (error) {
    console.error('Error fetching ventas mes anterior data:', error);
    throw new Error('Error fetching ventas mes anterior data');
  }
}   

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
    console.error('Error fetching ordenes recientes data:', error);
    throw new Error('Error fetching ordenes recientes data');
  }
}   

export async function fetchVentasXCategoria() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.ventasXCategoria);
    return response.data.data.map(item => ({
      categoria: item.categoria,
      total: item.total,
      porcentaje: item.porcentaje
    }));
  } catch (error) {
    console.error('Error fetching ventas x categoria data:', error);
    throw new Error('Error fetching ventas x categoria data');
  }      
}

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
    console.error('Error fetching productos mas vendidos data:', error);
    throw new Error('Error fetching productos mas vendidos data');
  }
}
