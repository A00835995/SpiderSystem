class OrdenCompraDto {
    //Convertir los datos de la orden a un formato 
    static toDatabase(ordenData) {
        //validar que los datos de la orden sean correctos
        if (!ordenData.idProv || !ordenData.idPago || !ordenData.fechaPedido || !ordenData.fechaEntrega || !ordenData.items) {
            throw new Error('Datos de orden incompletos');
        }

        // Formatear las fechas para LONGDATE (YYYY-MM-DD)
        const fechaPedido = new Date(ordenData.fechaPedido).toISOString().split('T')[0];
        const fechaEntrega = new Date(ordenData.fechaEntrega).toISOString().split('T')[0];

        // Transformar los items al formato esperado por la base de datos
        const productos = ordenData.items.map(item => ({
            ItemId: item.ItemId,
            ItemQuantity: item.ItemQuantity,
            ItemPrice: item.ItemPrice
        }));

        return {
            idProv: ordenData.idProv,
            idPago: ordenData.idPago,
            fechaPedido: fechaPedido,
            fechaEntrega: fechaEntrega,
            items: productos
        };
    }

    static toResponse(dbResult) {
        // Verificar que dbResult existe y tiene las propiedades necesarias
        if (!dbResult || typeof dbResult !== 'object') {
            throw new Error('No se recibió respuesta del stored procedure');
        }

        if (!('IDORDEN' in dbResult) || !('MENSAJE' in dbResult)) {
            throw new Error('La respuesta del stored procedure no tiene el formato esperado');
        }

        return {
            ordenId: dbResult.IDORDEN,
            mensaje: dbResult.MENSAJE
        };
    }
}

module.exports = OrdenCompraDto;