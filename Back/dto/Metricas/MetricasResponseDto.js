class MetricasResponseDto {
    constructor() {}

    // DTO para la respuesta del resumen financiero (mensual/anual)
    static resumenFinancieroResponse(data, periodo) {
        return {
            success: true,
            message: `Resumen financiero ${periodo} obtenido exitosamente`,
            data: {
                ventasTotales: {
                    valor: parseFloat(data.VENTAS_TOTALES) || 0,
                    cambio: parseFloat(data.VARIACION_VENTAS) || 0,
                    modeloMasVendido: data.MODELO_MAS_VENDIDO || 'No disponible'
                },
                ganancias: {
                    valor: parseFloat(data.GANANCIAS_TOTALES) || 0,
                    cambio: parseFloat(data.VARIACION_GANANCIAS) || 0,
                    margenPromedio: parseFloat(data.MARGEN_PROMEDIO) || 0
                }
            },
            periodo: periodo,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de ventas por categoría
    static ventasPorCategoriaResponse(data, periodo) {
        return {
            success: true,
            message: `Ventas por categoría ${periodo} obtenidas exitosamente`,
            data: data.map(categoria => ({
                categoria: categoria.CATEGNOMB,
                porcentaje: `${parseFloat(categoria.PORCENTAJE) || 0}%`,
                valor: parseFloat(categoria.TOTAL_VENTAS) || 0,
                ranking: data.indexOf(categoria) + 1
            })),
            count: data.length,
            periodo: periodo,
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

module.exports = MetricasResponseDto; 