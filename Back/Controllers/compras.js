const { executeQuery } = require('../Utils/dbUtils');
const ComprasDto = require('../dto/Compras/ComprasDto');
const OrdenCompraDto = require('../dto/Compras/OrdenCompraDto');

// Funciones auxiliares comunes
const handleError = (res, error, message) => {
    console.error(`Error: ${message}`, error);
    return res.status(500).json({
        message: message,
        error: error.message,
        stack: error.stack
    });
};

const validateOrderId = (id) => {
    if (!id) {
        throw new Error('Se requiere el ID de la orden');
    }
};

const extractSuccessMessage = (result) => {
    if (!result || !Array.isArray(result) || result.length === 0) {
        return 'Actualización exitosa';
    }

    return result[0]?.MENSAJE || 
           (result[0] && typeof result[0] === 'object' && Object.values(result[0])[0]) || 
           'Actualización exitosa';
};

const handleSpecificErrors = (error) => {
    if (!error.code) {
        return {
            statusCode: 500,
            errorMessage: error.message
        };
    }

    const errorMap = {
        10001: { message: 'La orden no existe o ha sido eliminada', status: 404 },
        10002: { message: 'La orden ya está completada', status: 409 }
    };

    const errorInfo = errorMap[error.code] || {
        message: error.sqlState ? 
            `Error en la base de datos (${error.sqlState}): ${error.message}` : 
            error.message,
        status: 500
    };

    return {
        statusCode: errorInfo.status,
        errorMessage: errorInfo.message
    };
};

// Controladores principales
exports.getComprasData = async(req, res) => {
    try {
        const [comprasResult, pagoResult] = await Promise.all([
            executeQuery('CALL MostrarProveedores()'),
            executeQuery('CALL FormaPagoCompra()')
        ]);
        
        const providerId = req.query.providerId ? parseInt(req.query.providerId) : null;
        const articulosResult = providerId ? 
            await executeQuery('CALL MostrarArticulosCompras(?)', [providerId]) : 
            [];

        return res.status(200).json({
            message: 'Datos de compras obtenidos correctamente',
            data: {
                articulos: ComprasDto.toArticulosResponse(articulosResult),
                proveedores: ComprasDto.toProveedoresResponse(comprasResult),
                pagos: ComprasDto.toPagosResponse(pagoResult)
            }
        });
    } catch (error) {
        return handleError(res, error, 'Error al obtener datos de compras');
    }
};

exports.getArticulosPorProveedor = async(req, res) => {
    try {
        const providerId = parseInt(req.params.providerId);
        
        if (!providerId) {
            return res.status(400).json({
                message: 'Se requiere un ID de proveedor válido'
            });
        }
        
        const articulosResult = await executeQuery('CALL MostrarArticulosCompras(?)', [providerId]);
        const transformedData = ComprasDto.toArticulosResponse(articulosResult);
        
        return res.status(200).json({
            message: 'Artículos obtenidos correctamente',
            data: transformedData
        });
    } catch (error) {
        return handleError(res, error, 'Error al obtener artículos por proveedor');
    }
};

exports.crearOrdenCompra = async (req, res) => {
    try {
        const ordenData = OrdenCompraDto.toDatabase(req.body);
        const result = await executeQuery('CALL DBADMIN.PR_CREAR_ORDEN_COMPRA(?)', [
            JSON.stringify(ordenData)
        ]);

        const spResult = result[0];
        if (!spResult || !spResult.IDORDEN) {
            throw new Error('El stored procedure no devolvió un resultado válido');
        }

        const response = OrdenCompraDto.toResponse(spResult);
        return res.status(201).json(response);
    } catch (error) {
        return handleError(res, error, 'Error al crear la orden de compra');
    }
};

exports.getOrdenesEnProgreso = async (req, res) => {
    try {
        const result = await executeQuery('CALL OBTENERORDENESPROG()');
        
        if (!result || result.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron órdenes en progreso'
            });
        }

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
        return handleError(res, error, 'Error al obtener órdenes en progreso');
    }
};

exports.actualizarOrdenACompletada = async (req, res) => {
    try {
        const { IdOrden } = req.body;
        
        try {
            validateOrderId(IdOrden);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

            const result = await executeQuery('CALL DBADMIN.ActualizarEstadoOrdenCompletada(?)', [IdOrden]);
        const mensaje = extractSuccessMessage(result);

            return res.status(200).json({
                success: true,
                message: 'Estado de la orden actualizado correctamente a Completada',
                data: {
                    ordenId: IdOrden,
                    mensaje: mensaje
                }
            });
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        const { statusCode, errorMessage } = handleSpecificErrors(error);
        
        return res.status(statusCode).json({
            success: false,
            message: 'Error al actualizar el estado de la orden',
            error: errorMessage,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
};