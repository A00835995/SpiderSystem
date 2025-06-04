import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

/**
 * Función para obtener los datos de compras (artículos, proveedores y métodos de pago)
 * @returns {Promise<{
 *   articulos: Array<{id: number, nombre: string, descripcion: string, precioCompra: string}>,
 *   proveedores: Array<{id: number, nombre: string}>,
 *   pagos: Array<{id: number, nombre: string}>
 * }>}
 */
export async function fetchComprasData() {
    try {
        const response = await axiosInstance.get(API_CONFIG.endpoints.compras.getData);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching compras data:', error);
        throw new Error('Error al obtener los datos de compras');
    }
}

/**
 * Función para obtener artículos filtrados por proveedor
 * @param {number} providerId - ID del proveedor
 * @returns {Promise<Array<{id: number, nombre: string, descripcion: string, precioCompra: string}>>}
 */
export async function fetchArticulosPorProveedor(providerId) {
    try {
        if (!providerId) {
            throw new Error('Se requiere un ID de proveedor');
        }
        
        const url = `${API_CONFIG.endpoints.compras.articulos}/${providerId}`;
        const response = await axiosInstance.get(url);
        
        // Transformar los datos para que coincidan con la estructura esperada
        if (response.data && response.data.data) {
            return response.data.data.map(item => ({
                id: item.id,
                name: item.nombre,
                description: item.descripcion,
                price: parseFloat(item.precioCompra)
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching articulos por proveedor:', error);
        throw new Error('Error al obtener los artículos por proveedor');
    }
}

/**
 * Función para crear una nueva orden de compra
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function createOrder(orderData) {
    try {
        const response = await axiosInstance.post(API_CONFIG.endpoints.compras.crearOrden, orderData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la orden:', error);
        throw new Error(error.response?.data?.message || 'Error al crear la orden');
    }
}

/**
 * Función para obtener órdenes en progreso
 * @returns {Promise<Array>} - Lista de órdenes en progreso
 */
export async function fetchOrdenesEnProgreso() {
    try {
        const response = await axiosInstance.get(API_CONFIG.endpoints.compras.ordenesProgreso);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener órdenes en progreso:', error);
        throw new Error('Error al obtener órdenes en progreso');
    }
}

/**
 * Función para actualizar una orden a completada
 * @param {number} ordenId - ID de la orden
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function completarOrden(ordenId) {
    try {
        const response = await axiosInstance.post(API_CONFIG.endpoints.compras.completarOrden, { ordenId });
        return response.data;
    } catch (error) {
        console.error('Error al completar la orden:', error);
        throw new Error(error.response?.data?.message || 'Error al completar la orden');
    }
} 