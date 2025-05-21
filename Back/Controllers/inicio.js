const { executeQuery } = require('../Utils/dbUtils');
const InicioResponseDto = require('../dto/Inicio/InicioResponseDto');

exports.getOrdenesPendientes = async (req, res) => {
    try{
        const result = await executeQuery('CALL ORDENESPENDIENTES()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron ordenes pendientes" });
        }

        // Transformar el resultado usando el DTO
        const ordenesPendientes = InicioResponseDto.toOrdenesPendientesResponse(result);

        return res.status(200).json({
            message: "Ordenes pendientes obtenidas exitosamente",
            data: ordenesPendientes
        });

    } catch (error){
        console.error("Error en getOrdenesPendientes:", error.message);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
};

exports.getVentasMes = async (req, res) => {
    try{
        const result = await executeQuery('CALL VENTASMES()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas mensuales" });
        }

        // Transformar el resultado usando el DTO
        const ventasMes = InicioResponseDto.toVentasMesResponse(result);

        return res.status(200).json({
            message: "Ventas mensuales obtenidas exitosamente",
            data: ventasMes
        });

    } catch (error){
        console.error("Error en getVentasMes:", error.message);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
};

exports.getProductosInventario = async (req, res) => {
    try{
        const result = await executeQuery('CALL PRODUCTOSINVENTARIO()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos en inventario" });
        }

        // Transformar el resultado usando el DTO
        const productosInventario = InicioResponseDto.toProductosInventarioResponse(result);

        return res.status(200).json({
            message: "Productos en inventario obtenidos exitosamente",
            data: productosInventario
        });

    } catch (error){
        console.error("Error en getProductosInventario:", error.message);
        res.status(500).json({  
            message: "Error en el servidor",    
            error: error.message
        });
    }
};

exports.getVentasMesAnterior = async (req, res) => {
    try{
        const result = await executeQuery('CALL "PorcentajeVentasMesAnterior"()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas mensuales anteriores" });
        }

        // Transformar el resultado usando el DTO
        const ventasMesAnterior = InicioResponseDto.toVentasMesAnteriorResponse(result);

        return res.status(200).json({
            message: "Ventas mensuales anteriores obtenidas exitosamente",
            data: ventasMesAnterior
        });

    } catch (error){
        console.error("Error en getVentasMesAnterior:", error.message); 
        res.status(500).json({  
            message: "Error en el servidor",
            error: error.message
        });
    }
};

exports.getOrdenesRecientes = async (req, res) => {
    try{
        const result = await executeQuery('CALL "Ultimas4OrdenesResumen"()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron ultimas 4 ordenes resumen" });
        }

        // Transformar el resultado usando el DTO
        const ordenesRecientes = InicioResponseDto.toOrdenesRecientesList(result);

        return res.status(200).json({
            message: "Ultimas 4 ordenes resumen obtenidas exitosamente",
            data: ordenesRecientes
        });

    } catch (error){
        console.error("Error en getOrdenesRecientes:", error.message); 
        res.status(500).json({  
            message: "Error en el servidor",
            error: error.message
        });
    }
};

exports.getVentasXCategoria = async (req, res) => {
    try{
        const result = await executeQuery('CALL "VentasPorCategoria"()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron ventas por categoria" });
        }

        // Transformar el resultado usando el DTO
        const ventasXCategoria = InicioResponseDto.toVentasXCategoriaList(result);

        return res.status(200).json({
            message: "Ventas por categoria obtenidas exitosamente",
            data: ventasXCategoria
        });

    } catch (error){
        console.error("Error en getVentasXCategoria:", error.message);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
};

exports.getProductosMasVendidosMesActual = async (req, res) => {
    try{
        const result = await executeQuery('CALL "TOP3_PRODUCTOS_MES_ACTUAL"()');

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos mas vendidos del mes actual" });
        }
        // Transformar el resultado usando el DTO
        const productosMasVendidosMesActual = InicioResponseDto.toProductosMasVendidosMesActualList(result);

        return res.status(200).json({
            message: "Productos mas vendidos del mes actual obtenidos exitosamente",
            data: productosMasVendidosMesActual
        });
    } catch (error){
        console.error("Error en getProductosMasVendidosMesActual:", error.message);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
}

