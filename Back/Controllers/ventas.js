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
    console.log("===== INICIO DE REGISTRO DE VENTA =====");
    console.log("Iniciando registro de venta...");
    
    // Obtener el JSON de venta desde el cuerpo de la solicitud
    const ventaJSON = req.body;
    console.log("JSON recibido:", JSON.stringify(ventaJSON, null, 2));
    
    // Validar que el JSON contenga la estructura esperada
    if (!ventaJSON || !ventaJSON.venta || !ventaJSON.detalles || !Array.isArray(ventaJSON.detalles) || ventaJSON.detalles.length === 0) {
      console.log("Error de validación: estructura JSON inválida");
      return res.status(400).json({
        success: false,
        message: "Formato de datos inválido. Se requiere un objeto con 'venta' y 'detalles'."
      });
    }
    
    // Convertir el objeto JavaScript a una cadena JSON para pasarlo al stored procedure
    const ventaJSONString = JSON.stringify(ventaJSON);
    console.log("Llamando al stored procedure con parámetros:", ventaJSONString);
    
    try {
      // Ejecutar el stored procedure para registrar la venta
      console.log("Ejecutando CALL DBADMIN.PR_REGISTRAR_VENTA_V2...");
      const procedureName = "DBADMIN.PR_REGISTRAR_VENTA_V2";
      console.log(`Usando procedimiento: ${procedureName}`);
      
      const result = await executeQuery(`CALL ${procedureName}(?)`, [ventaJSONString]);
      console.log("Resultado del stored procedure (completo):", JSON.stringify(result));
      
      // Verificar el resultado
      if (!result || !result[0]) {
        console.log("No se obtuvo resultado del stored procedure o resultado vacío");
        return res.status(500).json({
          success: false,
          message: "No se pudo registrar la venta"
        });
      }
      
      console.log("Resultado del stored procedure (primera fila):", JSON.stringify(result[0]));
      
      // Si todo fue exitoso
      console.log(`Venta registrada exitosamente con ID: ${result[0]["IdVenta"]}`);
      console.log("===== FIN DE REGISTRO DE VENTA (ÉXITO) =====");
      
      return res.status(201).json({
        success: true,
        message: "Venta registrada exitosamente",
        data: {
          IdVenta: result[0]["IdVenta"],
          Mensaje: result[0]["Mensaje"]
        }
      });
    } catch (dbError) {
      console.error("Error al ejecutar el stored procedure:", dbError);
      console.error("Detalles del error:", {
        message: dbError.message,
        code: dbError.code,
        sqlState: dbError.sqlState,
        stack: dbError.stack
      });
      
      // Verificar si hay detalles específicos del error de base de datos
      const errorDetails = dbError.message || "Error desconocido en la base de datos";
      console.log("===== FIN DE REGISTRO DE VENTA (ERROR DB) =====");
      
      return res.status(500).json({
        success: false,
        message: "Error en la base de datos al registrar la venta",
        error: errorDetails,
        code: dbError.code,
        sqlState: dbError.sqlState
      });
    }
    
  } catch (error) {
    console.error("Error general en registrarVenta:", error);
    console.error("Stack trace:", error.stack);
    console.log("===== FIN DE REGISTRO DE VENTA (ERROR GENERAL) =====");
    
    return res.status(500).json({
      success: false,
      message: "Error al registrar la venta",
      error: error.message
    });
  }
};
