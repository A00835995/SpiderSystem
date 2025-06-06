import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

/**
 * Servicio para gestionar las operaciones de proveedores
 */

// Obtener todos los proveedores con información resumida
export async function fetchProveedoresResumen() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.getProveedoresResumen);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw new Error('Error al obtener proveedores');
  }
}

// Obtener detalles completos de un proveedor específico
export async function fetchDetalleProveedor(id) {
  try {
    const url = API_CONFIG.endpoints.getDetalleProveedor.replace(':id', id);
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener detalles del proveedor con ID ${id}:`, error);
    throw new Error(`Error al obtener detalles del proveedor con ID ${id}`);
  }
}

// Obtener tipos de proveedores disponibles
export async function fetchTiposProveedores() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.getTiposProveedores);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de proveedores:', error);
    throw new Error('Error al obtener tipos de proveedores');
  }
}

// Obtener tipos de pagos disponibles
export async function fetchTiposPagosProveedores() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.getTiposPagosProveedores);
    return response.data;
  } catch (error) {
    console.error('Error al obtener tipos de pagos:', error);
    throw new Error('Error al obtener tipos de pagos');
  }
}

// Crear un nuevo proveedor
export async function crearProveedor(proveedorData) {
  try {
    const response = await axiosInstance.post(API_CONFIG.endpoints.crearProveedor, proveedorData);
    return response.data;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw new Error(`Error al crear proveedor: ${error.message}`);
  }
}

// Actualizar nombre del proveedor
export async function actualizarNombreProveedor(id, nombre) {
  try {
    const url = API_CONFIG.endpoints.actualizarNombreProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { nombre });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar nombre del proveedor:', error);
    throw new Error(`Error al actualizar nombre del proveedor: ${error.message}`);
  }
}

// Actualizar nombre del contacto del proveedor
export async function actualizarNombreContactoProveedor(id, nombreContacto) {
  try {
    const url = API_CONFIG.endpoints.actualizarNombreContactoProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { nombreContacto });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar nombre del contacto:', error);
    throw new Error(`Error al actualizar nombre del contacto: ${error.message}`);
  }
}

// Actualizar teléfono del proveedor
export async function actualizarTelefonoProveedor(id, telefono) {
  try {
    const url = API_CONFIG.endpoints.actualizarTelefonoProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { telefono });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar teléfono del proveedor:', error);
    throw new Error(`Error al actualizar teléfono del proveedor: ${error.message}`);
  }
}

// Actualizar email del proveedor
export async function actualizarEmailProveedor(id, email) {
  try {
    const url = API_CONFIG.endpoints.actualizarEmailProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { email });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar email del proveedor:', error);
    throw new Error(`Error al actualizar email del proveedor: ${error.message}`);
  }
}

// Actualizar dirección del proveedor
export async function actualizarDireccionProveedor(id, direccion) {
  try {
    const url = API_CONFIG.endpoints.actualizarDireccionProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { direccion });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar dirección del proveedor:', error);
    throw new Error(`Error al actualizar dirección del proveedor: ${error.message}`);
  }
}

// Actualizar tipo de proveedor
export async function actualizarTipoProveedor(id, tipoProveedor) {
  try {
    const url = API_CONFIG.endpoints.actualizarTipoProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { id, tipoProveedor });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar tipo de proveedor:', error);
    throw new Error(`Error al actualizar tipo de proveedor: ${error.message}`);
  }
}

// Actualizar tipo de pago del proveedor
export async function actualizarTipoPagoProveedor(id, tipoPago) {
  try {
    const url = API_CONFIG.endpoints.actualizarTipoPagoProveedor.replace(':id', id);
    const response = await axiosInstance.put(url, { id, tipoPago });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar tipo de pago del proveedor:', error);
    throw new Error(`Error al actualizar tipo de pago del proveedor: ${error.message}`);
  }
}

// Obtener resumen por categorías
export async function fetchResumenCategorias() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.getResumenCategorias);
    return response.data;
  } catch (error) {
    console.error('Error al obtener resumen de categorías:', error);
    throw new Error('Error al obtener resumen de categorías');
  }
}

// Obtener distribución de proveedores por inventario
export async function fetchDistribucionProveedorInventario() {
  try {
    const response = await axiosInstance.get(API_CONFIG.endpoints.getDistribucionProveedorInventario);
    return response.data;
  } catch (error) {
    console.error('Error al obtener distribución de inventario:', error);
    throw new Error('Error al obtener distribución de inventario');
  }
}

// Eliminar proveedor (soft delete)
export async function eliminarProveedor(id) {
  try {
    const url = API_CONFIG.endpoints.eliminarProveedor.replace(':id', id);
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    throw new Error(`Error al eliminar proveedor: ${error.message}`);
  }
}
