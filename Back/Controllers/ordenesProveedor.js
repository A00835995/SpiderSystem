const { executeQuery } = require('../Utils/dbUtils');
const OrdenesProveedorDto = require('../dto/OrdenesProveedor/OrdenesProveedorDto');
const OrdenCompraConsultaDto = require('../dto/OrdenesProveedor/OrdenCompraConsultaDto');

/**
 * Obtiene todas las órdenes de proveedor
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getOrdenesProveedor = async (req, res) => {
    try {
        // Ejecutar el stored procedure
        const result = await executeQuery('CALL GETordenedesProveedor()');
        
        // Verificar si hay resultados
        if (!result || result.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron órdenes de proveedor'
            });
        }

        // Usar el DTO para transformar los datos
        const ordenesFormateadas = OrdenesProveedorDto.toResponse(result);

        return res.status(200).json({
            message: 'Órdenes de proveedor obtenidas correctamente',
            data: ordenesFormateadas
        });
    } catch (error) {
        console.error('Error al obtener órdenes de proveedor:', error);
        return res.status(500).json({
            message: 'Error al obtener órdenes de proveedor',
            error: error.message
        });
    }
}; 

/**
 * Consulta los detalles de una orden de compra específica con todos sus artículos
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.consultarOrdenCompra = async (req, res) => {
    try {
        const { IdOrden } = req.body;
        
        console.log('Parámetros recibidos:', { IdOrden });
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        // Usar el DTO para formatear los datos para el stored procedure
        const requestData = OrdenCompraConsultaDto.toDatabase({ IdOrden });
        
        // Crear el objeto JSON para el stored procedure
        const jsonData = JSON.stringify(requestData);
        
        // Ejecutar el stored procedure
        const result = await executeQuery('CALL ConsultarOrdenCompra(?)', [jsonData]);
        
        // Verificar si hay resultados
        if (!result || result.length === 0) {
            return res.status(404).json({
                message: 'No se encontró la orden de compra especificada'
            });
        }
        
        // Analizar la estructura detallada
        if (Array.isArray(result)) {
            // Usar el DTO para formatear la respuesta con todos los artículos
            const respuesta = OrdenCompraConsultaDto.toResponse(result);

            return res.status(200).json({
                message: 'Detalle de orden de compra obtenido correctamente',
                data: respuesta
            });
        } else {
            // Si no podemos identificar la estructura
            return res.status(500).json({
                message: 'Formato de respuesta del stored procedure no reconocido',
                debug: { 
                    resultType: typeof result, 
                    isArray: Array.isArray(result), 
                    result: JSON.stringify(result, null, 2) 
                }
            });
        }
    } catch (error) {
        console.error('Error al consultar la orden de compra:', error);
        return res.status(500).json({
            message: 'Error al consultar la orden de compra',
            error: error.message,
            stack: error.stack
        });
    }
}; 

/**
 * Actualiza el estado de una orden a "En Proceso" (IdOrdStat = 3)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.actualizarOrdenAProceso = async (req, res) => {
    try {
        const { IdOrden } = req.body;
        
        console.log('Actualizando orden a En Proceso:', { IdOrden });
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        // Ejecutar el stored procedure o consulta directa
        const result = await executeQuery('CALL ActualizarEstadoOrdenProceso(?)', [IdOrden]);
        
        // También se podría hacer con una consulta directa:
        // const result = await executeQuery('UPDATE Orden SET IdOrdStat = 3 WHERE IdOrden = ?', [IdOrden]);
        
        console.log('Resultado de la actualización:', JSON.stringify(result, null, 2));

        return res.status(200).json({
            message: 'Estado de la orden actualizado correctamente a En Proceso',
            ordenId: IdOrden
        });
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        return res.status(500).json({
            message: 'Error al actualizar el estado de la orden',
            error: error.message,
            stack: error.stack
        });
    }
}; 