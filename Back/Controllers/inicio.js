const { executeQuery } = require('../Utils/dbUtils');

exports.getOrdenesPendientes = async (req, res) => {
    try{
        const result = await executeQuery('CALL ORDENESPENDIENTES()');
        res.status(200).json({  
            message: "Ordenes pendientes obtenidas exitosamente",
            data: result
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
        res.status(200).json({
            message: "Ventas mensuales obtenidas exitosamente",
            data: result
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
        res.status(200).json({
            message: "Productos en inventario obtenidos exitosamente",
            data: result
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
        const result = await executeQuery('CALL PorcentajeVentasMesAnterior()');
        res.status(200).json({
            message: "Ventas mensuales anteriores obtenidas exitosamente",
            data: result
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
        const result = await executeQuery('CALL Ultimas4OrdenesResumen()');
        res.status(200).json({
            message: "Ultimas 4 ordenes resumen obtenidas exitosamente",
            data: result
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
        const result = await executeQuery('CALL VentasPorCategoria()');
        res.status(200).json({
            message: "Ventas por categoria obtenidas exitosamente",
            data: result
        });
    } catch (error){
        console.error("Error en getVentasXCategoria:", error.message);
        res.status(500).json({
            
        })
    }
};

