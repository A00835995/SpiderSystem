const { executeQuery } = require('../Utils/dbUtils');
const VentaResponseDto = require('../dto/Ventas/VentaResponseDto');

/**
 * Obtiene los artículos disponibles para venta
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} Respuesta con los artículos disponibles
 */
exports.getArticulosParaVenta = async (req, res) => {
  try {
    // Ejecutar el stored procedure para obtener artículos disponibles para venta
    const result = await executeQuery(`CALL ObtenerArticulosVenta()`);

    if (!result || result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No se encontraron artículos disponibles para venta" 
      });
    }

    // Transformar los datos usando el DTO
    const articulos = VentaResponseDto.toArticulosParaVentaList(result);

    return res.status(200).json({
      success: true,
      message: "Artículos para venta obtenidos exitosamente",
      data: articulos
    });
    
  } catch (error) {
    console.error("Error en getArticulosParaVenta:", error.message);
    return res.status(500).json({ 
      success: false,
      message: "Error al obtener artículos para venta", 
      error: error.message 
    });
  }
};

/**
 * Registra una venta con sus detalles
 * @param {Object} req - Objeto de solicitud con el JSON de venta
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} Respuesta con el resultado de la operación
 */
exports.registrarVenta = async (req, res) => {
  try {
    // Obtener el JSON de venta desde el cuerpo de la solicitud
    const ventaJSON = req.body;
    
    // Validar que el JSON contenga la estructura esperada
    if (!ventaJSON || !ventaJSON.venta || !ventaJSON.detalles || !Array.isArray(ventaJSON.detalles) || ventaJSON.detalles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Formato de datos inválido. Se requiere un objeto con 'venta' y 'detalles'."
      });
    }
    
    // Convertir el objeto JavaScript a una cadena JSON para pasarlo al stored procedure
    const ventaJSONString = JSON.stringify(ventaJSON);
    
    // Ejecutar el stored procedure para registrar la venta
    const result = await executeQuery(`CALL DBADMIN.PR_REGISTRAR_VENTA(?)`, [ventaJSONString]);
    
    // Verificar el resultado
    if (!result || !result[0]) {
      return res.status(500).json({
        success: false,
        message: "No se pudo registrar la venta"
      });
    }
    
    // Si todo fue exitoso
    return res.status(201).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: {
        IdVenta: result[0]["IdVenta"],
        Mensaje: result[0]["Mensaje"]
      }
    });
    
  } catch (error) {
    console.error("Error en registrarVenta:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al registrar la venta",
      error: error.message
    });
  }
};
