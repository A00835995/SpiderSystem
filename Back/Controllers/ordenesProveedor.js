const { executeQuery } = require('../Utils/dbUtils');
const OrdenesProveedorDto = require('../dto/OrdenesProveedor/OrdenesProveedorDto');
const OrdenCompraConsultaDto = require('../dto/OrdenesProveedor/OrdenCompraConsultaDto');
const jwt = require('jsonwebtoken');

/**
 * Obtiene todas las órdenes de proveedor
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getOrdenesProveedor = async (req, res) => {
    try {
        // Obtener el token de autorización
        const authHeader = req.headers.authorization;
        console.log('Headers recibidos:', req.headers);
        console.log('Header de autorización:', authHeader);
        
        let proveedorId = null;
        
        // Si hay token, extraer el ID del proveedor
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                console.log('Token extraído:', token.substring(0, 20) + '...');
                
                const decoded = jwt.verify(token, process.env.JWT_SECRET || "seguridad");
                console.log('Token decodificado:', decoded);
                
                // Si el usuario es un proveedor y tiene ID de proveedor
                if (decoded.role === 4 && decoded.proveedorId) {
                    proveedorId = decoded.proveedorId;
                    console.log('ID de proveedor encontrado en token:', proveedorId);
                } else {
                    console.log('Usuario no es proveedor o no tiene ID de proveedor. Role:', decoded.role);
                }
            } catch (tokenError) {
                console.error('Error al verificar token:', tokenError.message);
                // Continuar sin ID de proveedor
            }
        } else {
            console.warn('No se recibió token de autorización');
        }
        
        let result;
        // Ejecutar el stored procedure correspondiente
        if (proveedorId) {
            // Si es un proveedor, obtener solo sus órdenes
            console.log('Ejecutando GETordenesProveedorPorId con ID:', proveedorId);
            result = await executeQuery('CALL GETordenesProveedorPorId(?)', [proveedorId]);
        } else {
            // Si no se identificó como proveedor, obtener todas las órdenes
            console.log('Ejecutando GETordenedesProveedor para todas las órdenes');
            result = await executeQuery('CALL GETordenedesProveedor()');
        }
        
        console.log('Resultado del SP:', result && result.length ? `${result.length} órdenes` : 'Sin resultados');
        
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
        
        // Obtener el token de autorización
        const authHeader = req.headers.authorization;
        let proveedorId = null;
        
        // Si hay token, extraer el ID del proveedor
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || "seguridad");
                
                // Si el usuario es un proveedor y tiene ID de proveedor
                if (decoded.role === 4 && decoded.proveedorId) {
                    proveedorId = decoded.proveedorId;
                }
            } catch (tokenError) {
                console.error('Error al verificar token:', tokenError.message);
                // Continuar sin ID de proveedor
            }
        }
        
        console.log('Parámetros recibidos:', { IdOrden, proveedorId });
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        // Preparar datos para el stored procedure
        const requestData = { IdOrden };
        
        // Si es un proveedor, incluir su ID para validación en el SP
        if (proveedorId) {
            requestData.IdProveedor = proveedorId;
        }
        
        // Usar el DTO para formatear los datos para el stored procedure
        const databaseData = OrdenCompraConsultaDto.toDatabase(requestData);
        
        // Crear el objeto JSON para el stored procedure
        const jsonData = JSON.stringify(databaseData);
        
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
        
        // Obtener el token de autorización
        const authHeader = req.headers.authorization;
        let proveedorId = null;
        
        // Si hay token, extraer el ID del proveedor
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || "seguridad");
                
                // Si el usuario es un proveedor y tiene ID de proveedor
                if (decoded.role === 4 && decoded.proveedorId) {
                    proveedorId = decoded.proveedorId;
                }
            } catch (tokenError) {
                console.error('Error al verificar token:', tokenError.message);
                // Continuar sin ID de proveedor
            }
        }
        
        console.log('Actualizando orden a En Proceso:', { IdOrden, proveedorId });
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        let result;
        // Ejecutar el stored procedure correspondiente
        if (proveedorId) {
            // Si es un proveedor, usar SP que valida el ID del proveedor
            result = await executeQuery('CALL ActualizarEstadoOrdenProcesoProveedor(?, ?)', [IdOrden, proveedorId]);
        } else {
            // Si es admin, puede actualizar cualquier orden
            result = await executeQuery('CALL ActualizarEstadoOrdenProceso(?)', [IdOrden]);
        }
        
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

/**
 * Actualiza el estado de una orden a "Completada" (IdOrdStat = 4) y actualiza las cantidades en inventario
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.actualizarOrdenACompletada = async (req, res) => {
    try {
        const { IdOrden } = req.body;
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        // Obtener el token de autorización para verificar permisos (opcional)
        const authHeader = req.headers.authorization;
        let userRole = null;
        
        // Si hay token, extraer información del usuario
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || "seguridad");
                userRole = decoded.role;
            } catch (tokenError) {
                console.error('Error al verificar token:', tokenError.message);
                // Continuar sin rol de usuario
            }
        }
        
        // Opcionalmente podrías verificar permisos aquí (solo admin o roles específicos)
        
        console.log('Actualizando orden a Completada:', { IdOrden, userRole });
        
        // Ejecutar el stored procedure para SAP HANA
        const result = await executeQuery('CALL ActualizarEstadoOrdenCompletada(?)', [IdOrden]);
        
        console.log('Resultado de la actualización a completada:', JSON.stringify(result, null, 2));

        // Extraer mensaje de éxito (la estructura de respuesta puede variar según la configuración de SAP HANA)
        let mensaje = 'Actualización exitosa';
        if (result && Array.isArray(result) && result.length > 0) {
            // Intentar encontrar el mensaje en diferentes posibles estructuras de respuesta
            mensaje = result[0]?.MENSAJE || 
                    (result[0] && typeof result[0] === 'object' && Object.values(result[0])[0]) || 
                    mensaje;
        }

        return res.status(200).json({
            success: true,
            message: 'Estado de la orden actualizado correctamente a Completada',
            data: {
                ordenId: IdOrden,
                mensaje: mensaje
            }
        });
    } catch (error) {
        console.error('Error al actualizar el estado de la orden a completada:', error);
        
        // Manejar errores específicos de SAP HANA
        let errorMessage = error.message;
        let statusCode = 500;
        
        // Códigos de error personalizados definidos en el stored procedure
        if (error.code) {
            switch (error.code) {
                case 10001:
                    errorMessage = 'La orden no existe o ha sido eliminada';
                    statusCode = 404;
                    break;
                case 10002:
                    errorMessage = 'La orden ya está completada';
                    statusCode = 409; // Conflict
                    break;
                default:
                    // Otros errores específicos de SAP HANA
                    if (error.sqlState) {
                        errorMessage = `Error en la base de datos (${error.sqlState}): ${error.message}`;
                    }
            }
        }
        
        return res.status(statusCode).json({
            success: false,
            message: 'Error al actualizar el estado de la orden',
            error: errorMessage,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
}; 