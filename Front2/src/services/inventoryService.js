import { API_CONFIG } from '../config/api';
import axiosInstance from '../config/axiosConfig';

//Funcion para obtener los datos del inventario
export async function fetchInventoryData() {
    try {
        //Uso axiosInstance para que agregue automáticamente el token JWT
        const response = await axiosInstance.get(API_CONFIG.endpoints.articles);
        
        //La respuesta ya viene como objeto JSON
        return response.data.data.map((item) => ({
            id: item.id,
            producto: item.nombre,
            sku: item.codigo,
            categoria: item.categoria,
            cantidad: item.existencia,
            ubicacion: item.ubicacion ? item.ubicacion.trim() : "Sin ubicación",
            proveedor: item.proveedor,
            estado: item.estado,
            ultimaActualizacion: new Date()
        }));
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        throw new Error('Error al obtener artículos');
    }
}
  
//Funcion para obtener el total de productos por estado
export async function fetchTotalInventoryCount() {
    try {
        // Get both the total count and status breakdown using axiosInstance
        const [totalResponse, statusResponse] = await Promise.all([
            axiosInstance.get(API_CONFIG.endpoints.totalCount),
            axiosInstance.get('/gettotalproductos')
        ]);
        
        const totalData = totalResponse.data.data;
        const statusData = statusResponse.data.data;
        
        return {
            disponibles: statusData.Disponible || 0,
            bajoStock: statusData["Bajo Stock"] || 0,
            agotados: statusData.Agotado || 0,
            total: totalData.total || 0
        };
    } catch (error) {
        console.error('Error al obtener total de productos:', error);
        return {
            disponibles: 0,
            bajoStock: 0,
            agotados: 0,
            total: 0
        };
    }
}
  