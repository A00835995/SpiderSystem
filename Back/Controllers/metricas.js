const { executeQuery } = require('../Utils/dbUtils');
const MetricasResponseDto = require('../dto/Metricas/MetricasResponseDto');

exports.getResumenFinancieroMes = async (req, res) => {
    try {
        const { mes, anio } = req.params;

        if (!mes || !anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requieren los parámetros mes y año',
                ['mes', 'anio']
            );
            return res.status(400).json(response);
        }

        // Validar que mes esté entre 1 y 12
        if (mes < 1 || mes > 12) {
            const response = MetricasResponseDto.validationErrorResponse(
                'El mes debe estar entre 1 y 12'
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL RESUMEN_FINANCIERO_MES(?, ?)', [mes, anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron datos financieros para el período especificado",
                "Resumen Financiero Mensual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.resumenFinancieroResponse(result[0], 'mensual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getResumenFinancieroMes:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener resumen financiero mensual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getResumenFinancieroAnio = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requiere el parámetro año',
                ['anio']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL RESUMEN_FINANCIERO_ANIO(?)', [anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron datos financieros para el año especificado",
                "Resumen Financiero Anual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.resumenFinancieroResponse(result[0], 'anual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getResumenFinancieroAnio:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener resumen financiero anual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getVentasPorCategoriaMes = async (req, res) => {
    try {
        const { mes, anio } = req.params;

        if (!mes || !anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requieren los parámetros mes y año',
                ['mes', 'anio']
            );
            return res.status(400).json(response);
        }

        // Validar que mes esté entre 1 y 12
        if (mes < 1 || mes > 12) {
            const response = MetricasResponseDto.validationErrorResponse(
                'El mes debe estar entre 1 y 12'
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL VENTAS_POR_CATEGORIA_MES(?, ?)', [mes, anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron ventas por categoría para el período especificado",
                "Ventas por Categoría Mensual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.ventasPorCategoriaResponse(result, 'mensual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getVentasPorCategoriaMes:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener ventas por categoría mensual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getVentasPorCategoriaAnio = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requiere el parámetro año',
                ['anio']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL VENTAS_POR_CATEGORIA_ANIO(?)', [anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron ventas por categoría para el año especificado",
                "Ventas por Categoría Anual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.ventasPorCategoriaResponse(result, 'anual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getVentasPorCategoriaAnio:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener ventas por categoría anual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getIndicadoresClienteVentaMes = async (req, res) => {
    try {
        const { mes, anio } = req.params;

        if (!mes || !anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requieren los parámetros mes y año',
                ['mes', 'anio']
            );
            return res.status(400).json(response);
        }

        // Validar que mes esté entre 1 y 12
        if (mes < 1 || mes > 12) {
            const response = MetricasResponseDto.validationErrorResponse(
                'El mes debe estar entre 1 y 12'
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL INDICADORES_CLIENTE_VENTA_MES(?, ?)', [mes, anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron indicadores de cliente para el período especificado",
                "Indicadores Cliente Mensual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.indicadoresClienteResponse(result[0], 'mensual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getIndicadoresClienteVentaMes:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener indicadores de cliente mensual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getIndicadoresClienteVentaAnio = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requiere el parámetro año',
                ['anio']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL INDICADORES_CLIENTE_VENTA_ANIO(?)', [anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron indicadores de cliente para el año especificado",
                "Indicadores Cliente Anual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.indicadoresClienteResponse(result[0], 'anual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getIndicadoresClienteVentaAnio:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener indicadores de cliente anual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getIndicadoresCompletosMes = async (req, res) => {
    try {
        const { mes, anio } = req.params;

        if (!mes || !anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requieren los parámetros mes y año',
                ['mes', 'anio']
            );
            return res.status(400).json(response);
        }

        // Validar que mes esté entre 1 y 12
        if (mes < 1 || mes > 12) {
            const response = MetricasResponseDto.validationErrorResponse(
                'El mes debe estar entre 1 y 12'
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL INDICADORES_MES(?, ?)', [mes, anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron indicadores para el período especificado",
                "Indicadores Completos Mensual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.indicadoresCompletosResponse(result[0], 'mensual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getIndicadoresCompletosMes:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener indicadores completos mensual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getIndicadoresCompletosAnio = async (req, res) => {
    try {
        const { anio } = req.params;

        if (!anio) {
            const response = MetricasResponseDto.validationErrorResponse(
                'Se requiere el parámetro año',
                ['anio']
            );
            return res.status(400).json(response);
        }

        const result = await executeQuery('CALL INDICADORES_ANIO(?)', [anio]);

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron indicadores para el año especificado",
                "Indicadores Completos Anual"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.indicadoresCompletosResponse(result[0], 'anual');
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getIndicadoresCompletosAnio:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener indicadores completos anual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getResumenInventarioCompleto = async (req, res) => {
    try {
        let result;
        try {
            result = await executeQuery('CALL RESUMEN_INVENTARIO_COMPLETO()');
        } catch (spError) {
            // Fallback: usar RESUMEN_STOCK_POR_CATEGORIA y calcular resumen general
            const stockResult = await executeQuery('CALL RESUMEN_STOCK_POR_CATEGORIA()');
            
            if (!stockResult || stockResult.length === 0) {
                const response = MetricasResponseDto.notFoundResponse(
                    "No se encontraron datos de inventario disponibles",
                    "Resumen Inventario Completo"
                );
                return res.status(404).json(response);
            }

            // Calcular resumen general a partir de stock por categoría
            const stockPorCategoria = stockResult;
            const stockTotal = stockPorCategoria.reduce((total, cat) => total + (cat.UNIDADES || 0), 0);
            const productosUnicos = stockPorCategoria.reduce((total, cat) => total + (cat.PRODUCTOS_EN_CATALOGO || 0), 0);
            
            // Crear resumen general calculado
            const resumenGeneral = {
                STOCK_TOTAL: stockTotal,
                PRODUCTOS_UNICOS: productosUnicos,
                UNIDADES_BAJO_STOCK: 0, // No podemos calcularlo sin más información
                PRODUCTOS_BAJO_STOCK: 0  // No podemos calcularlo sin más información
            };

            const response = MetricasResponseDto.resumenInventarioCompletoResponse(
                resumenGeneral, 
                stockPorCategoria
            );
            
            return res.status(200).json(response);
        }
        
        // Verificar si el SP existe y retorna algo
        if (!result) {
            const response = MetricasResponseDto.notFoundResponse(
                "El stored procedure RESUMEN_INVENTARIO_COMPLETO no devolvió resultados",
                "Resumen Inventario Completo"
            );
            return res.status(404).json(response);
        }

        // Para stored procedures que devuelven múltiples result sets, 
        // SAP HANA puede estructurar los resultados de manera diferente
        if (result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron datos de inventario (result array vacío)",
                "Resumen Inventario Completo"
            );
            return res.status(404).json(response);
        }

        // Revisar si es un solo result set o múltiples
        let resumenGeneral, stockPorCategoria;

        if (result.length >= 2) {
            // El SP devuelve 2 result sets:
            resumenGeneral = result[0][0]; // Primer elemento del primer result set
            stockPorCategoria = result[1]; // Segundo result set completo
        } else if (result.length === 1) {
            // El SP principal solo devolvió resumen general, obtener categorías por separado
            if (Array.isArray(result[0]) && result[0].length > 0) {
                resumenGeneral = result[0][0];
            } else {
                resumenGeneral = result[0];
            }
            
            // Obtener stock por categoría usando el SP que sabemos que funciona
            try {
                const stockResult = await executeQuery('CALL RESUMEN_STOCK_POR_CATEGORIA()');
                stockPorCategoria = stockResult || [];
            } catch (stockError) {
                stockPorCategoria = [];
            }
        }

        // Validar que tenemos al menos el resumen general
        if (!resumenGeneral) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se pudo procesar los datos de inventario",
                "Resumen Inventario Completo"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.resumenInventarioCompletoResponse(
            resumenGeneral, 
            stockPorCategoria || []
        );
        
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getResumenInventarioCompleto:", error.message);
        
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener resumen de inventario completo",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getStockPorCategoria = async (req, res) => {
    try {
        const result = await executeQuery('CALL RESUMEN_STOCK_POR_CATEGORIA()');

        if (!result || result.length === 0) {
            const response = MetricasResponseDto.notFoundResponse(
                "No se encontraron datos de stock por categoría",
                "Stock por Categoría"
            );
            return res.status(404).json(response);
        }

        const response = MetricasResponseDto.stockPorCategoriaResponse(result);
        return res.status(200).json(response);

    } catch (error) {
        console.error("Error en getStockPorCategoria:", error.message);
        const response = MetricasResponseDto.errorResponse(
            "Error en el servidor al obtener stock por categoría",
            error.message
        );
        res.status(500).json(response);
    }
}; 