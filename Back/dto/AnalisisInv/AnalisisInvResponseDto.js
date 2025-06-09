class AnalisisInvResponseDto {
    constructor() {}

    // Función helper para manejar valores NULL de manera consistente
    static safeParseFloat(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '') {
            return defaultValue;
        }
        
        if (isNaN(value)) {
            return defaultValue;
        }
        
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    // Función helper para manejar valores enteros NULL
    static safeParseInt(value, defaultValue = 0) {
        if (value === null || value === undefined || value === '' || isNaN(value)) {
            return defaultValue;
        }
        const parsed = parseInt(value);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    // Función helper para obtener nombre del mes
    static getMonthName(monthNumber) {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return months[monthNumber - 1] || `Mes ${monthNumber}`;
    }

    // DTO para la respuesta de análisis de inventario
    static analisisInventarioResponse(data, anio) {
        // Resumen
        const totalValorInventario = data.reduce((sum, item) => sum + this.safeParseFloat(item.VALOR_INVENTARIO), 0);
        const productosBajoStock = data.filter(item => this.safeParseInt(item.EXISTENCIA_ACTUAL) < 10).length;
        const totalProductos = data.length;
        const totalDeficit = data.reduce((sum, item) => sum + this.safeParseInt(item.DEFICIT_ESTIMADO), 0);
        const totalRiesgo = data.filter(item => (item.RIESGO || '').toUpperCase() === 'SÍ' || (item.RIESGO || '').toUpperCase() === 'SI').length;

        return {
            success: true,
            message: `Análisis de inventario para ${anio} obtenido exitosamente`,
            data: {
                anio: anio,
                productos: data.map(item => ({
                    artiId: this.safeParseInt(item.ID),
                    artNombre: item.NOMBRE || 'Producto sin nombre',
                    categoria: item.CATEGORIA || '',
                    existenciaActual: this.safeParseInt(item.EXISTENCIA_ACTUAL),
                    prediccion: this.safeParseInt(item.PREDICCION),
                    costoUnitario: this.safeParseFloat(item.COSTO_UNITARIO),
                    valorInventario: this.safeParseFloat(item.VALOR_INVENTARIO),
                    deficitEstimado: this.safeParseInt(item.DEFICIT_ESTIMADO),
                    riesgo: item.RIESGO,
                    diasCobertura: this.safeParseFloat(item.DIAS_COBERTURA, null),
                    ultimaCompra: item.ULTIMA_COMPRA,
                    diasPromEntreOrdenes: this.safeParseFloat(item.DIAS_PROM_ENTRE_ORDENES, null)
                })),
                resumen: {
                    totalProductos,
                    totalValorInventario,
                    productosBajoStock,
                    totalDeficit,
                    totalRiesgo
                }
            },
            count: totalProductos,
            timestamp: new Date().toISOString()
        };
    }

    // Función helper para determinar el estado del stock
    static getEstadoStock(porcentajeCobertura, diferencia) {
        if (diferencia === 0) {
            return 'EQUILIBRADO';
        } else if (diferencia > 0) {
            if (porcentajeCobertura > 150) {
                return 'EXCESO_ALTO';
            } else if (porcentajeCobertura > 120) {
                return 'EXCESO_MODERADO';
            } else {
                return 'EXCESO_LEVE';
            }
        } else {
            if (porcentajeCobertura < 25) {
                return 'DEFICIT_CRITICO';
            } else if (porcentajeCobertura < 50) {
                return 'DEFICIT_ALTO';
            } else if (porcentajeCobertura < 80) {
                return 'DEFICIT_MODERADO';
            } else {
                return 'DEFICIT_LEVE';
            }
        }
    }

    // Función helper para determinar el tipo de situación
    static getTipoSituacion(existencia, prediccion) {
        if (prediccion === 0) {
            return existencia > 0 ? 'STOCK_SIN_DEMANDA' : 'SIN_STOCK_SIN_DEMANDA';
        } else if (existencia === 0) {
            return 'SIN_STOCK_CON_DEMANDA';
        } else if (existencia > prediccion) {
            return 'SOBRESTOCK';
        } else if (existencia < prediccion) {
            return 'UNDERSTOCK';
        } else {
            return 'STOCK_OPTIMO';
        }
    }

    // Función helper para generar recomendaciones
    static generateRecomendacion(existencia, prediccion, porcentajeCobertura) {
        const diferencia = existencia - prediccion;
        
        if (prediccion === 0) {
            return existencia > 0 ? 
                `Evaluar liquidación de ${existencia} unidades sin demanda prevista.` :
                'Producto sin stock ni demanda. Monitoreo normal.';
        }
        
        if (existencia === 0) {
            return `Stock agotado. Pedido urgente de ${prediccion} unidades para cubrir demanda.`;
        }
        
        if (diferencia > 0) {
            const exceso = Math.abs(diferencia);
            if (porcentajeCobertura > 150) {
                return `Exceso significativo de ${exceso} unidades (${porcentajeCobertura}% cobertura). Considerar promociones.`;
            } else {
                return `Stock ligeramente excedente (${porcentajeCobertura}% cobertura). Monitoreo rutinario.`;
            }
        } else {
            const deficit = Math.abs(diferencia);
            if (porcentajeCobertura < 50) {
                return `Déficit crítico de ${deficit} unidades. Pedido urgente requerido.`;
            } else {
                return `Déficit moderado de ${deficit} unidades. Programar reabastecimiento.`;
            }
        }
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

module.exports = AnalisisInvResponseDto;
