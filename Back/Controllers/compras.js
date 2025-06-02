const { executeQuery } = require('../Utils/dbUtils');
const ComprasDto = require('../dto/Compras/ComprasDto');
const OrdenCompraDto = require('../dto/Compras/OrdenCompraDto');

exports.getComprasData = async(req,res) => {
    try {
        //Ejecutar los stored procedures
        //Promise sirve para ejecutar varias consultas al mismo tiempo
        const [articulosResult, comprasResult, pagoResult] = await Promise.all([
            executeQuery('CALL MostrarArticulosCompras()'),
            executeQuery('CALL MostrarProveedores()'),
            executeQuery('CALL FormaPagoCompra()')
        ]);

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
        const { IdOrden } = req.body;
        
        // Validar que se reciba el ID de la orden
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        console.log('Actualizando orden a Completada:', { IdOrden });
        
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