const { executeQuery } = require('../Utils/dbUtils');
const OrdenesProveedorDto = require('../dto/OrdenesProveedor/OrdenesProveedorDto');
const OrdenCompraConsultaDto = require('../dto/OrdenesProveedor/OrdenCompraConsultaDto');
const jwt = require('jsonwebtoken');

// Funciones auxiliares comunes
const extractProviderIdFromToken = (authHeader) => {
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || "seguridad");
        
                if (decoded.role === 4 && decoded.proveedorId) {
            return decoded.proveedorId;
        }
    } catch (error) {
        console.error('Error al verificar token:', error.message);
    }
    return null;
};

const validateOrderId = (id) => {
    if (!id) {
        throw new Error('Se requiere el ID de la orden');
                }
};

const handleError = (res, error, message) => {
    console.error(`Error: ${message}`, error);
    return res.status(500).json({
        message: message,
        error: error.message,
        stack: error.stack
    });
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
exports.getOrdenesProveedor = async (req, res) => {
    try {
        const proveedorId = extractProviderIdFromToken(req.headers.authorization);
        const data = await executeQuery(
            proveedorId ? 'CALL GETordenesProveedorPorId(?)' : 'CALL GETordenedesProveedor()',
            proveedorId ? [proveedorId] : []
        );

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron órdenes de proveedor'
            });
        }

        return res.status(200).json({
            message: 'Órdenes de proveedor obtenidas correctamente',
            data: OrdenesProveedorDto.toResponse(data)
        });
    } catch (error) {
        return handleError(res, error, 'Error al obtener órdenes de proveedor');
    }
}; 

exports.consultarOrdenCompra = async (req, res) => {
    try {
        const { IdOrden } = req.body;
        const proveedorId = extractProviderIdFromToken(req.headers.authorization);
        
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        const requestData = { IdOrden, ...(proveedorId && { IdProveedor: proveedorId }) };
        const databaseData = OrdenCompraConsultaDto.toDatabase(requestData);
        const data = await executeQuery('CALL ConsultarOrdenCompra(?)', [JSON.stringify(databaseData)]);
        
        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'No se encontró la orden de compra especificada'
            });
        }

            return res.status(200).json({
                message: 'Detalle de orden de compra obtenido correctamente',
            data: OrdenCompraConsultaDto.toResponse(data)
        });
    } catch (error) {
        return handleError(res, error, 'Error al consultar la orden de compra');
    }
}; 

exports.actualizarOrdenAProceso = async (req, res) => {
    try {
        const { IdOrden } = req.body;
        const proveedorId = extractProviderIdFromToken(req.headers.authorization);
        
        if (!IdOrden) {
            return res.status(400).json({
                message: 'Se requiere el ID de la orden'
            });
        }

        await executeQuery(
            proveedorId ? 'CALL ActualizarEstadoOrdenProcesoProveedor(?, ?)' : 'CALL ActualizarEstadoOrdenProceso(?)',
            proveedorId ? [IdOrden, proveedorId] : [IdOrden]
        );

        return res.status(200).json({
            message: 'Estado de la orden actualizado correctamente a En Proceso',
            ordenId: IdOrden
        });
    } catch (error) {
        return handleError(res, error, 'Error al actualizar el estado de la orden');
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

        const data = await executeQuery('CALL ActualizarEstadoOrdenCompletada(?)', [IdOrden]);
        const mensaje = data?.[0]?.MENSAJE || 'Actualización exitosa';

        return res.status(200).json({
            success: true,
            message: 'Estado de la orden actualizado correctamente a Completada',
            data: {
                ordenId: IdOrden,
                mensaje: mensaje
            }
        });
    } catch (error) {
        const { statusCode, errorMessage } = handleSpecificErrors(error);
        return res.status(statusCode).json({
            success: false,
            message: 'Error al actualizar el estado de la orden',
            error: errorMessage,
            code: error.code || 'UNKNOWN_ERROR'
        });
    }
}; 