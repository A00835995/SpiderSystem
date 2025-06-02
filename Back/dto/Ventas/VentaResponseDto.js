/**
 * DTO para respuestas relacionadas con ventas
 */
class VentaResponseDto {
    /**
     * Transforma un artículo de la base de datos en formato para venta
     * @param {Object} dbArticulo - Artículo de la base de datos
     * @returns {Object} Artículo formateado para venta
     */
    static toArticuloParaVenta(dbArticulo) {
        return {
            id: dbArticulo.ARTIID,
            nombre: dbArticulo.ARTNOMBRE,
            precioVenta: dbArticulo.ARTPRECIOVENTA,
            iva: dbArticulo.ARTIVA,
            existencia: dbArticulo.ARTEXISTENCIA,
            // Calcular precio con IVA
            precioConIva: dbArticulo.ARTPRECIOVENTA * (1 + (dbArticulo.ARTIVA / 100))
        };
    }

    /**
     * Transforma una lista de artículos de la base de datos en formato para venta
     * @param {Array} dbArticulos - Lista de artículos de la base de datos
     * @returns {Array} Lista de artículos formateados para venta
     */
    static toArticulosParaVentaList(dbArticulos) {
        if (!Array.isArray(dbArticulos)) {
            return [];
        }
        return dbArticulos.map(articulo => this.toArticuloParaVenta(articulo));
    }

    
}

module.exports = VentaResponseDto; 