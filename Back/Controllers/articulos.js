const { executeQuery } = require('../Utils/dbUtils');
const ArticuloResponseDto = require('../dto/Articulos/ArticuloResponseDto');

// Function para visualizar todos los artículos
exports.getArticulos = async (req, res) => {
  try {
    //Llamo a la función para que ejecuta el Query
    const result = await executeQuery(`CALL ArticulosDTO()`);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No se encontraron artículos" });
    }

    // Transformar los datos usando el DTO
    const articulos = ArticuloResponseDto.toResponseList(result);

    return res.status(200).json({
      message: "Artículos obtenidos exitosamente",
      data: articulos
    });
    
  } catch (error) {
    console.error("Error en getArticulos:", error.message);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

//Function para obtener el total de productos
exports.getTotalArticulos = async (req,res) => {
  try{
    //Llamo la función para que pueda correr el stored procedure
    const result = await executeQuery('Call contarProductos()');

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No se encontró información de productos" });
    }

    // Transformar el resultado usando el DTO
    const totalData = ArticuloResponseDto.toTotalResponse(result);

    return res.status(200).json({
      message: "Total de productos obtenido exitosamente",
      data: totalData
    });
  } catch (error){
    console.error("Error en getTotalProductos:", error.message);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

//Function para contar los estados
exports.getTotalProductos = async (req, res) => {
  try {
    const result = await executeQuery(`CALL CONTARESTADOS()`);

    // Transformar el resultado usando el DTO
    const estados = ArticuloResponseDto.toEstadosResponse(result);

    return res.status(200).json({
      message: "Total de productos por estado obtenido exitosamente",
      data: estados
    });

  } catch (error) {
    console.error("Error en getTotalProductos:", error.message);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};



