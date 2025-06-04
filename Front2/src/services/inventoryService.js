import { API_CONFIG } from '../config/api';

//Funcion para obtener los datos del inventario
export async function fetchInventoryData() {
    //CONSIGO EL URL DEL BACKEND
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.articles}`);
    if (!response.ok) {
        throw new Error('Error al obtener artículos');
    }
    //Consigo la respuesta en formato JSON
    const json = await response.json();
    
    //Json.data es el array de objetos
    //.map es para recorrer el array de objetos
    //item es cada objeto del array
    return json.data.map((item) => ({
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
}
  
//Funcion para obtener el total de productos por estado
export async function fetchTotalInventoryCount() {
    try {
        // Get both the total count and status breakdown
        const [totalResponse, statusResponse] = await Promise.all([
            fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.totalCount}`),
            fetch(`${API_CONFIG.baseUrl}/gettotalproductos`)
        ]);

        if (!totalResponse.ok || !statusResponse.ok) {
            throw new Error('Error al obtener total de productos');
        }

        const { data: totalData } = await totalResponse.json();
        const { data: statusData } = await statusResponse.json();
        
        return {
            disponibles: statusData.Disponible || 0,
            bajoStock: statusData["Bajo Stock"] || 0,
            agotados: statusData.Agotado || 0,
            total: totalData.total || 0
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            disponibles: 0,
            bajoStock: 0,
            agotados: 0,
            total: 0
        };
    }
}
  