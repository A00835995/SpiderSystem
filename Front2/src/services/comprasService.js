import { API_CONFIG } from '../config/api';

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
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.compras.getData}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener datos de compras');
        }

        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching compras data:', error);
        throw new Error('Error al obtener los datos de compras');
    }
} 