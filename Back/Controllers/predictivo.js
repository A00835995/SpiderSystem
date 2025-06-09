const { executeQuery } = require('../Utils/dbUtils');
const PredictivoResponseDto = require('../dto/Predictivo/PredictivoResponseDto');

exports.getTendenciaVentasAnual = async (req, res) => {
    try {
        const { anio } = req.params;

        // Validar que se proporcione el año
        if (!anio) {
            const response = PredictivoResponseDto.validationErrorResponse(
                'Se requiere el parámetro año',
                ['anio']
            );
            return res.status(400).json(response);
        }

        // Validar que el año sea un número válido
        const anioNum = parseInt(anio);
        if (isNaN(anioNum) || anioNum < 2020 || anioNum > 2030) {
            const response = PredictivoResponseDto.validationErrorResponse(
                'El año debe ser un número válido entre 2020 y 2030'
            );
            return res.status(400).json(response);
        }

        console.log(`🔍 Obteniendo tendencia de ventas para el año: ${anioNum}`);

        // Ejecutar el stored procedure
        const result = await executeQuery('CALL "DBADMIN"."GET_TENDENCIA_VENTAS_ANUAL"(?)', [anioNum]);

        if (!result || result.length === 0) {
            const response = PredictivoResponseDto.notFoundResponse(
                `No se encontraron datos de tendencia de ventas para el año ${anioNum}`,
                "Tendencia de Ventas Anual"
            );
            return res.status(404).json(response);
        }

        console.log(`📊 Datos obtenidos: ${result.length} registros para el año ${anioNum}`);
        console.log('📋 Muestra de datos:', result.slice(0, 3));

        // Generar respuesta usando el DTO
        const response = PredictivoResponseDto.tendenciaVentasAnualResponse(result, anioNum);
        return res.status(200).json(response);

    } catch (error) {
        console.error("❌ Error en getTendenciaVentasAnual:", error.message);
        console.error("🔍 Stack trace:", error.stack);
        
        const response = PredictivoResponseDto.errorResponse(
            "Error en el servidor al obtener tendencia de ventas anual",
            error.message
        );
        res.status(500).json(response);
    }
};

exports.getRiesgoStockFuturo = async (req, res) => {
    try {
        const { periodo } = req.params;

        // Validar que se proporcione el período
        if (!periodo) {
            const response = PredictivoResponseDto.validationErrorResponse(
                'Se requiere el parámetro período',
                ['periodo']
            );
            return res.status(400).json(response);
        }

        // Validar que el período sea un número válido (formato YYYYMM)
        const periodoNum = parseInt(periodo);
        if (isNaN(periodoNum) || periodo.length !== 6) {
            const response = PredictivoResponseDto.validationErrorResponse(
                'El período debe ser un número válido en formato YYYYMM (ej: 202507)'
            );
            return res.status(400).json(response);
        }

        // Validar rango de años (2020-2030)
        const anio = Math.floor(periodoNum / 100);
        const mes = periodoNum % 100;
        
        if (anio < 2020 || anio > 2030 || mes < 1 || mes > 12) {
            const response = PredictivoResponseDto.validationErrorResponse(
                'El período debe estar entre 202001 y 203012'
            );
            return res.status(400).json(response);
        }

        console.log(`🔍 Obteniendo riesgo de stock futuro para el período: ${periodoNum}`);

        // Ejecutar el stored procedure
        const result = await executeQuery('CALL "DBADMIN"."GET_RIESGO_STOCK_FUTURO"(?)', [periodoNum]);

        if (!result || result.length === 0) {
            const response = PredictivoResponseDto.notFoundResponse(
                `No se encontraron datos de riesgo de stock para el período ${periodoNum}`,
                "Riesgo de Stock Futuro"
            );
            return res.status(404).json(response);
        }

        console.log(`📊 Datos obtenidos: ${result.length} productos con análisis de riesgo para el período ${periodoNum}`);
        console.log('📋 Muestra de datos:', result.slice(0, 3));

        // Generar respuesta usando el DTO
        const response = PredictivoResponseDto.riesgoStockFuturoResponse(result, periodoNum);
        return res.status(200).json(response);

    } catch (error) {
        console.error("❌ Error en getRiesgoStockFuturo:", error.message);
        console.error("🔍 Stack trace:", error.stack);
        
        const response = PredictivoResponseDto.errorResponse(
            "Error en el servidor al obtener riesgo de stock futuro",
            error.message
        );
        res.status(500).json(response);
    }
};
