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