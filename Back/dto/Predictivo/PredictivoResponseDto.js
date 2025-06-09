class PredictivoResponseDto {
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

    // DTO para la respuesta de tendencia de ventas anual
    static tendenciaVentasAnualResponse(data, anio) {
        return {
            success: true,
            message: `Tendencia de ventas anual ${anio} obtenida exitosamente`,
            data: {
                anio: anio,
                meses: data.map(item => ({
                    mes: this.safeParseInt(item.MES),
                    nombreMes: this.getMonthName(this.safeParseInt(item.MES)),
                    ventasReales: this.safeParseInt(item.VENTAS_REALES),
                    prediccion: this.safeParseInt(item.PREDICCION),
                    tieneVentasReales: item.VENTAS_REALES !== null,
                    tienePrediccion: item.PREDICCION !== null,
                    diferencia: item.VENTAS_REALES !== null && item.PREDICCION !== null 
                        ? this.safeParseInt(item.PREDICCION) - this.safeParseInt(item.VENTAS_REALES)
                        : null
                }))
            },
            count: data.length,
            timestamp: new Date().toISOString()
        };
    }

    // DTO para la respuesta de riesgo de stock futuro
    static riesgoStockFuturoResponse(data, periodo) {
        // Función helper para formatear período
        const formatPeriodo = (periodo) => {
            const periodoStr = periodo.toString();
            const anio = periodoStr.substring(0, 4);
            const mes = periodoStr.substring(4, 6);
            return {
                anio: parseInt(anio),
                mes: parseInt(mes),
                nombreMes: this.getMonthName(parseInt(mes)),
                formato: `${this.getMonthName(parseInt(mes))} ${anio}`
            };
        };

        const periodoInfo = formatPeriodo(periodo);

        return {
            success: true,
            message: `Análisis de riesgo de stock futuro para ${periodoInfo.formato} obtenido exitosamente`,
            data: {
                periodo: periodo,
                periodoInfo: periodoInfo,
                productos: data.map(item => {
                    return {
                        artiId: this.safeParseInt(item.ARTIID),
                        artNombre: item.ARTNOMBRE || 'Producto sin nombre',
                        existenciaActual: this.safeParseInt(item.EXISTENCIA_ACTUAL),
                        prediccion: this.safeParseInt(item.PREDICCION),
                        ventaPromedioMensual: parseFloat(item.VENTA_PROMEDIO_MENSUAL) || 0,
                        diasPromEntreOrdenes: parseFloat(item.DIAS_PROM_ENTRE_ORDENES) || 0,
                        totalOrdenes: this.safeParseInt(item.TOTAL_ORDENES),
                        diasCobertura: parseFloat(item.DIAS_COBERTURA) || 0,
                        riesgo: item.RIESGO || 'DESCONOCIDO',
                        deficitEstimado: this.safeParseInt(item.DEFICIT_ESTIMADO),
                        prioridadReorden: this.safeParseInt(item.PRIORIDAD_REORDEN),
                        // Campos calculados adicionales
                        necesitaReorden: this.safeParseInt(item.DEFICIT_ESTIMADO) > 0,
                        porcentajeCobertura: item.PREDICCION > 0 ? 
                            Math.round((this.safeParseInt(item.EXISTENCIA_ACTUAL) / this.safeParseInt(item.PREDICCION)) * 100) : 0,
                        recomendacion: this.generateRecomendacion(item)
                    };
                }),
                resumen: {
                    totalProductos: data.length,
                    riesgoAlto: data.filter(item => item.RIESGO?.toUpperCase() === 'ALTO').length,
                    riesgoMedio: data.filter(item => item.RIESGO?.toUpperCase() === 'MEDIO').length,
                    riesgoBajo: data.filter(item => item.RIESGO?.toUpperCase() === 'BAJO').length,
                    riesgoCritico: data.filter(item => item.RIESGO?.toUpperCase() === 'CRITICO').length,
                    productosConDeficit: data.filter(item => this.safeParseInt(item.DEFICIT_ESTIMADO) > 0).length,
                    deficitTotalEstimado: data.reduce((sum, item) => sum + this.safeParseInt(item.DEFICIT_ESTIMADO), 0)
                }
            },
            count: data.length,
            timestamp: new Date().toISOString()
        };
    }

    // Función helper para generar recomendaciones
    static generateRecomendacion(item) {
        const riesgo = item.RIESGO?.toUpperCase();
        const deficit = this.safeParseInt(item.DEFICIT_ESTIMADO);
        const diasCobertura = parseFloat(item.DIAS_COBERTURA) || 0;
        
        if (riesgo === 'ALTO' && deficit > 0) {
            return `Pedido urgente de ${deficit} unidades. Stock crítico con solo ${Math.round(diasCobertura)} días de cobertura.`;
        } else if (riesgo === 'MEDIO' && deficit > 0) {
            return `Programar pedido de ${deficit} unidades para la próxima semana. Cobertura de ${Math.round(diasCobertura)} días.`;
        } else if (riesgo === 'ALTO' && deficit <= 0) {
            return `Monitorear de cerca. Stock ajustado pero en nivel de riesgo alto.`;
        } else if (diasCobertura < 15) {
            return `Considerar pedido preventivo. Cobertura de solo ${Math.round(diasCobertura)} días.`;
        } else {
            return `Stock en nivel aceptable. Cobertura de ${Math.round(diasCobertura)} días.`;
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

module.exports = PredictivoResponseDto;
