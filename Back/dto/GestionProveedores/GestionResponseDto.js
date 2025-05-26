class GestionProveedoresResponseDto {
    constructor() {}

    // DTO para la respuesta de la lista de proveedores
    static proveedoresResumenResponse(proveedores) {
        return {
            success: true,
            message: "Proveedores obtenidos exitosamente",
            data: proveedores.map(proveedor => ({
                idProveedor: proveedor.IDPROV,
                nombreProveedor: proveedor.NOMBREPROVEEDOR,
                ultimoPedido: proveedor.ULTIMOPEDIDO ? 
                    new Date(proveedor.ULTIMOPEDIDO).toISOString().split('T')[0] : null,
                nombreContacto: proveedor.NOMBRECONTACTO,
                telefono: proveedor.TELEFONO,
                email: proveedor.EMAIL,
                numeroProductos: proveedor.NUMEROPRODUCTOS || 0,
                tipoProveedor: proveedor.TIPOPROVEEDOR
            })),
            count: proveedores.length,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de detalles de un proveedor
    static detalleProveedorResponse(detalleProveedor) {
        const proveedor = Array.isArray(detalleProveedor) ? detalleProveedor[0] : detalleProveedor;
        
        return {
            success: true,
            message: "Detalles del proveedor obtenidos exitosamente",
            data: {
                nombreProveedor: proveedor.NOMBREPROVEEDOR,
                nombreContacto: proveedor.NOMBRECONTACTO,
                email: proveedor.EMAIL,
                telefono: proveedor.TELEFONO,
                direccion: proveedor.DIRECCION,
                tipoProveedor: proveedor.TIPOPROVEEDOR,
                numeroProductos: proveedor.NUMEROPRODUCTOS || 0,
                totalExistencia: proveedor.TOTALEXISTENCIA || 0,
                tipoPago: proveedor.TIPOPAGO,
                ultimoPedido: proveedor.ULTIMOPEDIDO ? 
                    new Date(proveedor.ULTIMOPEDIDO).toISOString().split('T')[0] : null
            },
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de creación de proveedor
    static createProveedorResponse(result) {
        return {
            success: true,
            message: "Proveedor creado exitosamente",
            data: {
                id: result.insertId || result.IDPROV,
                created: true
            },
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de actualización de proveedor
    static updateProveedorResponse(fieldUpdated, result) {
        return {
            success: true,
            message: `${fieldUpdated} del proveedor actualizado exitosamente`,
            data: {
                updated: true,
                affectedRows: result.affectedRows || 1
            },
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de resumen de categorías
    static resumenCategoriasResponse(categorias) {
        return {
            success: true,
            message: "Resumen de categorías obtenido exitosamente",
            data: categorias.map(categoria => ({
                nombreCategoria: categoria.CATEGNOMB,
                numeroProductos: categoria.NUMEROPRODUCTOS || 0,
                totalExistencia: categoria.TOTALEXISTENCIA || 0,
                numeroProveedores: categoria.NUMPROVEEDORES || 0,
                productosStockBajo: categoria.PRODUCTOSSTOCKBAJO || 0,
                valorInventarioCosto: categoria.VALORINVENTARIOCOSTO || 0,
                valorInventarioVenta: categoria.VALORINVENTARIOVENTA || 0
            })),
            count: categorias.length,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de distribución de proveedores por inventario
    static distribucionProveedorInventarioResponse(distribucion) {
        return {
            success: true,
            message: "Distribución de proveedores por inventario obtenida exitosamente",
            data: distribucion.map(item => ({
                tipoProveedor: item.TIPO_PROVEEDOR,
                cantidadProveedores: item.CANTIDAD_PROVEEDORES || 0,
                porcentajeParticipacion: parseFloat(item.PORCENTAJE_PARTICIPACION) || 0
            })),
            count: distribucion.length,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de tipos de proveedores
    static tiposDeProveedoresResponse(tiposProveedores) {
        return {
            success: true,
            message: "Tipos de proveedores obtenidos exitosamente",
            data: tiposProveedores.map(tipo => tipo.TIPOPROVEEDOR || tipo.NOMBRE || tipo),
            count: tiposProveedores.length,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de tipos de pagos
    static tiposDePagosResponse(tiposPagos) {
        return {
            success: true,
            message: "Tipos de pagos obtenidos exitosamente",
            data: tiposPagos.map(tipo => tipo.TIPOPAGOPROVEEDOR || tipo.NOMBRE || tipo),
            count: tiposPagos.length,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para respuestas de error
    static errorResponse(message, error = null, statusCode = 500) {
        return {
            success: false,
            message: message,
            error: error,
            statusCode: statusCode,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para respuesta de validación de campos faltantes
    static validationErrorResponse(message, requiredFields = []) {
        return {
            success: false,
            message: message,
            error: "Validation Error",
            requiredFields: requiredFields,
            statusCode: 400,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para respuesta cuando no se encuentran datos
    static notFoundResponse(message, resourceType = "Recurso") {
        return {
            success: false,
            message: message,
            error: "Not Found",
            resourceType: resourceType,
            statusCode: 404,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para respuesta de conflicto (como email duplicado)
    static conflictResponse(message, conflictField = null) {
        return {
            success: false,
            message: message,
            error: "Conflict",
            conflictField: conflictField,
            statusCode: 409,
            timestamp: new Date().toISOString()
        };
    }

    // DTO genérico para respuestas exitosas
    static successResponse(message, data = null) {
        return {
            success: true,
            message: message,
            data: data,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = GestionProveedoresResponseDto;
