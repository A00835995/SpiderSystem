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
        if (!dbArticulo) {
            return {
                id: undefined,
                nombre: undefined,
                precioVenta: undefined,
                iva: undefined,
                existencia: undefined,
                precioConIva: NaN
            };
        }

        const precioVenta = dbArticulo.ARTPRECIOVENTA;
        const iva = dbArticulo.ARTIVA;
        const precioConIva = precioVenta !== undefined && iva !== undefined 
            ? Number((precioVenta * (1 + (iva / 100))).toFixed(2))
            : NaN;

        return {
            id: dbArticulo.ARTIID,
            nombre: dbArticulo.ARTNOMBRE,
            precioVenta: precioVenta,
            iva: iva,
            existencia: dbArticulo.ARTEXISTENCIA,
            precioConIva: precioConIva
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