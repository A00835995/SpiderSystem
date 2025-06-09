const { executeQuery } = require('../Utils/dbUtils');
const AnalisisInvResponseDto = require('../dto/AnalisisInv/AnalisisInvResponseDto');

exports.getAnalisisInventario = async (req, res) => {
    try {
        const { anio } = req.params;

        // Validar que se proporcione el año
        if (!anio) {
            const response = AnalisisInvResponseDto.validationErrorResponse(
                'Se requiere el parámetro año',
                ['anio']
            );
            return res.status(400).json(response);
        }

        // Validar que el año sea un número válido (YYYY)
        const anioNum = parseInt(anio);
        if (isNaN(anioNum) || anio.length !== 4) {
            const response = AnalisisInvResponseDto.validationErrorResponse(
                'El año debe ser un número válido en formato YYYY (ej: 2025)'
            );
            return res.status(400).json(response);
        }

        // Validar rango de años (2020-2030)
        if (anioNum < 2020 || anioNum > 2030) {
            const response = AnalisisInvResponseDto.validationErrorResponse(
                'El año debe estar entre 2020 y 2030'
            );
            return res.status(400).json(response);
        }

        console.log(`🔍 Obteniendo análisis de inventario para el año: ${anioNum}`);

        // Ejecutar el stored procedure
        const result = await executeQuery('CALL "DBADMIN"."GET_ANALISIS_INVENTARIO"(?)', [anioNum]);

        if (!result || result.length === 0) {
            const response = AnalisisInvResponseDto.notFoundResponse(
                `No se encontraron datos de análisis de inventario para el año ${anioNum}`,
                "Análisis de Inventario"
            );
            return res.status(404).json(response);
        }

        console.log(`📊 Datos obtenidos: ${result.length} productos con análisis de inventario para el año ${anioNum}`);
        console.log('📋 Muestra de datos:', result.slice(0, 3));

        // Generar respuesta usando el DTO
        const response = AnalisisInvResponseDto.analisisInventarioResponse(result, anioNum);
        return res.status(200).json(response);

    } catch (error) {
        console.error("❌ Error en getAnalisisInventario:", error.message);
        console.error("🔍 Stack trace:", error.stack);
        
        const response = AnalisisInvResponseDto.errorResponse(
            "Error en el servidor al obtener análisis de inventario",
            error.message
        );
        res.status(500).json(response);
    }
};
