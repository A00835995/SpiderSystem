/**
 * DTO para los resultados de consulta de orden de compra
 */
class OrdenCompraConsultaDto {
    /**
     * Transforma la respuesta del stored procedure a un formato adecuado para el cliente
     * @param {Object|Array} data - Datos del stored procedure
     * @returns {Object} - Datos formateados
     */
    static toResponse(data) {
        if (!data) return null;
        
        // Función auxiliar para obtener el valor de un campo independientemente de la capitalización
        const getFieldValue = (obj, fieldName) => {
            // Primero intentar con el nombre exacto
            if (obj[fieldName] !== undefined) return obj[fieldName];
            
            // Intentar con el nombre en mayúsculas (común en SAP HANA)
            if (obj[fieldName.toUpperCase()] !== undefined) return obj[fieldName.toUpperCase()];
            
            // Intentar con el nombre en minúsculas
            if (obj[fieldName.toLowerCase()] !== undefined) return obj[fieldName.toLowerCase()];
            
            // Si no se encuentra, devolver null
            return null;
        };
        
        if (Array.isArray(data) && data.length > 0) {
            
            // Si tenemos un array de artículos, calcular totales y formatear
            let totalGeneral = 0;
            const articulos = data.map(item => {
                const cantidad = getFieldValue(item, 'OrdArtCant');
                const precioUnitario = getFieldValue(item, 'ArtprecioCompra');
                const subtotal = getFieldValue(item, 'Total');
                
                // Convertir a número para la suma
                const subtotalNumerico = parseFloat(subtotal) || 0;
                totalGeneral += subtotalNumerico;
                
                return {
                    articuloId: getFieldValue(item, 'ArtiId'),
                    nombreArticulo: getFieldValue(item, 'ArtNombre'),
                    cantidad: cantidad,
                    precioUnitario: precioUnitario,
                    subtotal: subtotal
                };
            });
            
            // Extraer datos comunes del primer elemento
            const primerElemento = data[0];
            
            const resultado = {
                ordenId: getFieldValue(primerElemento, 'IdOrden'),
                proveedorId: getFieldValue(primerElemento, 'IdProv'),
                proveedorNombre: getFieldValue(primerElemento, 'NomProv'),
                fechaEntrega: getFieldValue(primerElemento, 'FechaEntrega'),
                fechaMovimiento: getFieldValue(primerElemento, 'FecMovto'),
                estadoOrden: getFieldValue(primerElemento, 'OrdStatNom'),
                metodoPago: getFieldValue(primerElemento, 'PagoNom'),
                articulos: articulos,
                totalGeneral: totalGeneral.toFixed(2)
            };
            
            console.log('Resultado final del DTO:', JSON.stringify(resultado, null, 2));
            return resultado;
        } else if (typeof data === 'object') {
            // Si solo tenemos un artículo (objeto)
            const articuloId = getFieldValue(data, 'ArtiId');
            const nombreArticulo = getFieldValue(data, 'ArtNombre');
            const cantidad = getFieldValue(data, 'OrdArtCant');
            const precioUnitario = getFieldValue(data, 'ArtprecioCompra');
            const subtotal = getFieldValue(data, 'Total');
            
            const resultado = {
                ordenId: getFieldValue(data, 'IdOrden'),
                proveedorId: getFieldValue(data, 'IdProv'),
                proveedorNombre: getFieldValue(data, 'NomProv'),
                fechaEntrega: getFieldValue(data, 'FechaEntrega'),
                fechaMovimiento: getFieldValue(data, 'FecMovto'),
                estadoOrden: getFieldValue(data, 'OrdStatNom'),
                metodoPago: getFieldValue(data, 'PagoNom'),
                articulos: [{
                    articuloId,
                    nombreArticulo,
                    cantidad,
                    precioUnitario,
                    subtotal
                }],
                totalGeneral: subtotal
            };
            
            console.log('Resultado final del DTO (artículo único):', JSON.stringify(resultado, null, 2));
            return resultado;
        }
        
        // Si no pudimos procesar los datos
        console.error('No se pudo procesar los datos en el DTO:', data);
        return {
            error: 'Formato de datos no reconocido',
            articulos: [],
            totalGeneral: '0.00'
        };
    }

    /**
     * Transforma los datos del cliente al formato requerido por el stored procedure
     * @param {Object} requestData - Datos de la solicitud
     * @returns {Object} - Datos formateados para el stored procedure
     */
    static toDatabase(requestData) {
        return {
            IdOrden: requestData.IdOrden
            // Ya no necesitamos ArtiId porque consultamos todos los artículos
        };
    }
}

module.exports = OrdenCompraConsultaDto; 