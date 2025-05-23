const { executeQuery } = require('../Utils/dbUtils');
const AlertasResponseDto = require('../dto/Alertas/AlertasResponseDto');

exports.getAlertas = async (req, res) => {
    try{
        const result = await executeQuery('CALL GETALERTAS()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron alertas" });
        }
        
        const alertas = AlertasResponseDto.toAlertasList(result);

        return res.status(200).json({
            message: "Alertas obtenidas exitosamente",
            data: alertas
        });
    } catch (error) {
        console.error("Error en getAlertas:", error.message);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
}