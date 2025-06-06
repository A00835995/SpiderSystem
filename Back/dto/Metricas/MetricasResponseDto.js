class MetricasResponseDto {
    constructor() {}

    // Función helper para manejar valores NULL de manera consistente (solo para indicadores completos)
    static safeParseFloat(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '' || isNaN(value)) {
            return defaultValue;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    // Función helper para manejar valores enteros NULL (solo para indicadores completos)
    static safeParseInt(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '' || isNaN(value)) {
            return defaultValue;
        }
        const parsed = parseInt(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    // Función helper para manejar strings NULL (solo para indicadores completos)
    static safeString(value, defaultValue = 'No disponible') {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        return String(value).trim();
    }

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

    // DTO para la respuesta de indicadores de cliente
    static indicadoresClienteResponse(data, periodo) {
        return {
            success: true,
            message: `Indicadores de cliente ${periodo} obtenidos exitosamente`,
            data: {
                clientesNuevos: {
                    valor: parseInt(data.CLIENTES_NUEVOS) || 0,
                    cambio: parseFloat(data.VARIACION_CLIENTES) || 0,
                    tasaConversion: parseFloat(data.TASA_CONVERSION) || 0
                },
                ventaPromedio: {
                    valor: parseFloat(data.VENTA_PROMEDIO) || 0,
                    cambio: parseFloat(data.VARIACION_VENTA_PROM) || 0,
                    productosPorVenta: parseFloat(data.PRODUCTOS_POR_VENTA) || 0
                }
            },
            periodo: periodo,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de indicadores completos (nuevo SP) - MANEJA VALORES NULL
    static indicadoresCompletosResponse(data, periodo) {
        return {
            success: true,
            message: `Indicadores completos ${periodo} obtenidos exitosamente`,
            data: {
                ventasTotales: {
                    valor: this.safeParseFloat(data.VENTAS_TOTALES),
                    cambio: this.safeParseFloat(data.VARIACION_VENTAS),
                    modeloMasVendido: this.safeString(data.MODELO_MAS_VENDIDO)
                },
                ganancias: {
                    valor: this.safeParseFloat(data.GANANCIAS_TOTALES),
                    cambio: this.safeParseFloat(data.VARIACION_GANANCIAS),
                    margenPromedio: this.safeParseFloat(data.MARGEN_PROMEDIO)
                },
                clientesNuevos: {
                    valor: this.safeParseInt(data.CLIENTES_NUEVOS),
                    cambio: this.safeParseFloat(data.VARIACION_CLIENTES),
                    diaMasVentas: this.safeString(data.DIA_MAS_VENTAS)
                },
                ventaPromedio: {
                    valor: this.safeParseFloat(data.VENTA_PROMEDIO),
                    cambio: this.safeParseFloat(data.VARIACION_VENTA_PROM),
                    productosPorVenta: this.safeParseFloat(data.PROM_PRODUCTOS_POR_VENTA)
                }
            },
            periodo: periodo,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta del resumen de inventario completo
    static resumenInventarioCompletoResponse(resumenGeneral, stockPorCategoria) {
        return {
            success: true,
            message: "Resumen de inventario completo obtenido exitosamente",
            data: {
                resumenGeneral: {
                    stockTotal: this.safeParseInt(resumenGeneral.STOCK_TOTAL),
                    productosUnicos: this.safeParseInt(resumenGeneral.PRODUCTOS_UNICOS),
                    unidadesBajoStock: this.safeParseInt(resumenGeneral.UNIDADES_BAJO_STOCK),
                    productosBajoStock: this.safeParseInt(resumenGeneral.PRODUCTOS_BAJO_STOCK)
                },
                stockPorCategoria: stockPorCategoria.map((categoria, index) => ({
                    categoria: this.safeString(categoria.CATEGORIA, 'Sin categoría'),
                    unidades: this.safeParseInt(categoria.UNIDADES),
                    productos: this.safeParseInt(categoria.PRODUCTOS_EN_CATALOGO),
                    // Asignar colores automáticamente basado en el índice
                    color: this.getColorForCategory(index)
                }))
            },
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta del stock por categoría
    static stockPorCategoriaResponse(data) {
        return {
            success: true,
            message: "Stock por categoría obtenido exitosamente",
            data: data.map((categoria, index) => ({
                categoria: this.safeString(categoria.CATEGORIA, 'Sin categoría'),
                unidades: this.safeParseInt(categoria.UNIDADES),
                productos: this.safeParseInt(categoria.PRODUCTOS_EN_CATALOGO),
                color: this.getColorForCategory(index)
            })),
            count: data.length,
            timestamp: new Date().toISOString()
        };
    }

    // Función helper para asignar colores a las categorías
    static getColorForCategory(index) {
        const colors = [
            "#28a745", // Verde
            "#007bff", // Azul
            "#6f42c1", // Púrpura
            "#6c757d", // Gris
            "#17a2b8", // Cian
            "#fd7e14", // Naranja
            "#e83e8c", // Rosa
            "#20c997"  // Verde azulado
        ];
        return colors[index % colors.length];
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