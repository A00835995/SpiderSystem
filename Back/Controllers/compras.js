const { executeQuery } = require('../Utils/dbUtils');
const ComprasDto = require('../dto/Compras/ComprasDto');
const OrdenCompraDto = require('../dto/Compras/OrdenCompraDto');

exports.getComprasData = async(req,res) => {
    try {
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

exports.crearOrdenCompra = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);

        // Convertir y validar los datos usando el DTO
        const ordenData = OrdenCompraDto.toDatabase(req.body);
        console.log('Datos procesados:', ordenData);

        // Llamar al stored procedure con el JSON
        const result = await executeQuery('CALL DBADMIN.PR_CREAR_ORDEN_COMPRA(?)', [
            JSON.stringify(ordenData)
        ]);

        console.log('Resultado SP completo:', result);
        
        // SAP HANA devuelve un array con una única fila que contiene el resultado
        const spResult = result[0];
        console.log('Resultado SP procesado:', spResult);

        // Validar que tenemos un resultado válido
        if (!spResult || !spResult.IDORDEN) {
            throw new Error('El stored procedure no devolvió un resultado válido');
        }

        // Usar el DTO para transformar la respuesta
        const response = OrdenCompraDto.toResponse(spResult);
        console.log(response);
        return res.status(201).json(response);

    } catch (error) {
        console.error('Error detallado al crear la orden de compra:', error);
        return res.status(500).json({
            message: 'Error al crear la orden de compra',
            error: error.message,
            stack: error.stack
        });
    }
};