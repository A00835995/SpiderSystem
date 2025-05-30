/**
 * DTO para las órdenes de proveedor
 */
class OrdenesProveedorDto {
    /**
     * Transforma la respuesta del stored procedure a un formato adecuado para el cliente
     * @param {Array} data - Datos del stored procedure
     * @returns {Array} - Datos formateados
     */
    static toResponse(data) {
        if (!data || data.length === 0) return [];
        
        return data.map(orden => ({
            IDORDEN: orden.IDORDEN,
            FECHAENTREGA: orden.FECHAENTREGA,
            FECMOVTO: orden.FECMOVTO,
            ORDSTATNOM: orden.ORDSTATNOM,
            NOMPROV: orden.NOMPROV
        }));
    }
}

module.exports = OrdenesProveedorDto; 