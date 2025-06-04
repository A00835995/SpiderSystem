const { executeQuery } = require('../Utils/dbUtils');
const ComprasDto = require('../dto/Compras/ComprasDto');
const OrdenCompraDto = require('../dto/Compras/OrdenCompraDto');

exports.getComprasData = async(req,res) => {
    try {
        //Ejecutar los stored procedures para proveedores y formas de pago
        const [comprasResult, pagoResult] = await Promise.all([
            executeQuery('CALL MostrarProveedores()'),
            executeQuery('CALL FormaPagoCompra()')
        ]);
        
        // Obtener artículos si se proporciona un ID de proveedor
        let articulosResult = [];
        const providerId = req.query.providerId ? parseInt(req.query.providerId) : null;
        
        if (providerId) {
            // Si hay un ID de proveedor, obtener artículos filtrados
            articulosResult = await executeQuery('CALL MostrarArticulosCompras(?)', [providerId]);
        } else {
            // Si no hay ID de proveedor, devolver una lista vacía o realizar otra consulta
            // Puedes personalizar esto según tus necesidades
            articulosResult = [];
        }

        const responseData = {
            articulos: ComprasDto.toArticulosResponse(articulosResult),
            proveedores: ComprasDto.toProveedoresResponse(comprasResult),
            pagos: ComprasDto.toPagosResponse(pagoResult)
        };

        return res.status(200).json({
            message: 'Datos de compras obtenidos correctamente',
            data: responseData
        });
    } catch (error) {
        console.error('Error al obtener datos de compras:', error);
        return res.status(500).json({
            message: 'Error al obtener datos de compras',
            error: error.message
        });
    }
};

// Nuevo endpoint para obtener artículos por proveedor
exports.getArticulosPorProveedor = async(req, res) => {
    try {
        const providerId = parseInt(req.params.providerId);
        
        if (!providerId) {
            return res.status(400).json({
                message: 'Se requiere un ID de proveedor válido'
            });
        }
        
        const articulosResult = await executeQuery('CALL MostrarArticulosCompras(?)', [providerId]);
        
        return res.status(200).json({
            message: 'Artículos obtenidos correctamente',
            data: ComprasDto.toArticulosResponse(articulosResult)
        });
    } catch (error) {
        console.error('Error al obtener artículos por proveedor:', error);
        return res.status(500).json({
            message: 'Error al obtener artículos por proveedor',
            error: error.message
        });
    }
};

exports.crearOrdenCompra = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Convertir y validar los datos usando el DTO
        const ordenData = OrdenCompraDto.toDatabase(req.body);
        console.log('Datos procesados:', ordenData);

        // Llamar al stored procedure con el JSON
        const result = await executeQuery('CALL DBADMIN.PR_CREAR_ORDEN_COMPRA(?)', [
            JSON.stringify(ordenData)
        ]);

        console.log('Resultado SP completo:', result);
        
        // SAP HANA devuelve un array con una única fila que contiene el resultado
        const spResult = result[0];
        console.log('Resultado SP procesado:', spResult);

        // Validar que tenemos un resultado válido
        if (!spResult || !spResult.IDORDEN) {
            throw new Error('El stored procedure no devolvió un resultado válido');
        }

        // Usar el DTO para transformar la respuesta
        const response = OrdenCompraDto.toResponse(spResult);
        console.log(response);
        return res.status(201).json(response);

    } catch (error) {
        console.error('Error detallado al crear la orden de compra:', error);
        return res.status(500).json({
            message: 'Error al crear la orden de compra',
            error: error.message,
            stack: error.stack
        });
    }
};

/**
 * Obtiene las órdenes en progreso (estado 2 o 3)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getOrdenesEnProgreso = async (req, res) => {
    try {
        // Ejecutar el stored procedure para obtener órdenes en progreso
        const result = await executeQuery('CALL OBTENERORDENESPROG()');
        
        // Verificar si hay resultados
        if (!result || result.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron órdenes en progreso'
            });
        }

        // Transformar los datos a un formato adecuado para el frontend
        const ordenes = result.map(orden => ({
            id: orden.IDORDEN,
            proveedor: orden.NOMPROV,
            estado: orden.ORDSTATNOM
        }));

        return res.status(200).json({
            message: 'Órdenes en progreso obtenidas correctamente',
            data: ordenes
        });
    } catch (error) {
        console.error('Error al obtener órdenes en progreso:', error);
        return res.status(500).json({
            message: 'Error al obtener órdenes en progreso',
            error: error.message
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
        console.log('===== INICIO DE ACTUALIZACIÓN A COMPLETADA =====');
        const { IdOrden } = req.body;
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            console.log('Error: No se proporcionó el ID de la orden');
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        console.log('Actualizando orden a Completada:', { IdOrden, requestBody: req.body });
        
        try {
            // Ejecutar el stored procedure para SAP HANA
            console.log(`Ejecutando CALL ActualizarEstadoOrdenCompletada(${IdOrden})...`);
            const result = await executeQuery('CALL DBADMIN.ActualizarEstadoOrdenCompletada(?)', [IdOrden]);
            
            console.log('Resultado bruto de la actualización:', result);
            console.log('Resultado de la actualización (JSON):', JSON.stringify(result, null, 2));
            console.log('Tipo de resultado:', typeof result);
            
            if (Array.isArray(result)) {
                console.log('Longitud del array de resultados:', result.length);
                for (let i = 0; i < result.length; i++) {
                    console.log(`Elemento ${i}:`, result[i]);
                    console.log(`Tipo de elemento ${i}:`, typeof result[i]);
                    if (result[i]) {
                        console.log(`Propiedades de elemento ${i}:`, Object.keys(result[i]));
                    }
                }
            }

            // Extraer mensaje de éxito (la estructura de respuesta puede variar según la configuración de SAP HANA)
            let mensaje = 'Actualización exitosa';
            if (result && Array.isArray(result) && result.length > 0) {
                // Intentar encontrar el mensaje en diferentes posibles estructuras de respuesta
                mensaje = result[0]?.MENSAJE || 
                        (result[0] && typeof result[0] === 'object' && Object.values(result[0])[0]) || 
                        mensaje;
                console.log('Mensaje extraído:', mensaje);
            }

            console.log('===== FIN DE ACTUALIZACIÓN A COMPLETADA (ÉXITO) =====');
            return res.status(200).json({
                success: true,
                message: 'Estado de la orden actualizado correctamente a Completada',
                data: {
                    ordenId: IdOrden,
                    mensaje: mensaje
                }
            });
        } catch (dbError) {
            console.error('Error de base de datos al actualizar la orden:', dbError);
            console.error('Detalles del error de BD:', {
                message: dbError.message,
                code: dbError.code,
                sqlState: dbError.sqlState,
                stack: dbError.stack
            });
            
            // Manejar errores específicos de SAP HANA
            let errorMessage = dbError.message;
            let statusCode = 500;
            
            // Verificar si el error contiene detalles del stored procedure
            if (dbError.message.includes('ActualizarEstadoOrdenCompletada')) {
                console.log('Error en el stored procedure detectado');
                const matches = dbError.message.match(/line (\d+) col (\d+) \(at pos (\d+)\)/);
                if (matches) {
                    console.log(`Error en línea ${matches[1]}, columna ${matches[2]}, posición ${matches[3]}`);
                }
            }
            
            // Códigos de error personalizados definidos en el stored procedure
            if (dbError.code) {
                console.log(`Código de error detectado: ${dbError.code}`);
                switch (dbError.code) {
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
                        if (dbError.sqlState) {
                            errorMessage = `Error en la base de datos (${dbError.sqlState}): ${dbError.message}`;
                        }
                }
            }
            
            console.log('===== FIN DE ACTUALIZACIÓN A COMPLETADA (ERROR DB) =====');
            return res.status(statusCode).json({
                success: false,
                message: 'Error al actualizar el estado de la orden',
                error: errorMessage,
                details: dbError.message,
                code: dbError.code || 'UNKNOWN_ERROR',
                sqlState: dbError.sqlState
            });
        }
    } catch (error) {
        console.error('Error general al actualizar el estado de la orden:', error);
        console.error('Stack trace:', error.stack);
        console.log('===== FIN DE ACTUALIZACIÓN A COMPLETADA (ERROR GENERAL) =====');
        
        return res.status(500).json({
            success: false,
            message: 'Error general al actualizar el estado de la orden',
            error: error.message
        });
    }
};