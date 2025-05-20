const { executeQuery } = require('../Utils/dbUtils');
const ComprasDto = require('../dto/Compras/ComprasDto');

exports.getComprasData = async(req,res) => {
    try{
        //Ejecutar los stored procedures
        //Promise sirve para ejecutar varias consultas al mismo tiempo
        const [articulosResult, comprasResult, pagoResult] = await Promise.all([
            executeQuery('CALL MostrarArticulosCompras()'),
            executeQuery('CALL MostrarProveedores()'),
            executeQuery('CALL FormaPagoCompra()')
        ]);

        const responseData = {
            articulos: ComprasDto.toArticulosResponse(articulosResult),
            proveedores: ComprasDto.toProveedoresResponse(comprasResult),
            pagos: ComprasDto.toPagosResponse(pagoResult)
        };

        return res.status(200).json({
            message: 'Datos de compras obtenidos correctamente',
            data: responseData
        });
    } catch (error) {
        console.error('Error al obtener datos de compras:', error);
        return res.status(500).json({
            message: 'Error al obtener datos de compras',
            error: error.message
        });
    }

};

