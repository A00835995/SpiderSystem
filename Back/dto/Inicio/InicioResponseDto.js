class InicioResponseDto {
    // Para las órdenes pendientes
    static toOrdenesPendientesResponse(dbResult) {
        return {
            total: dbResult[0]?.CUENTAORDENESPEND || 0
        };
    }

    // Para las ventas mensuales
    static toVentasMesResponse(dbResult) {
        return {
            mes: dbResult[0]?.MES || 0,          
            ano: dbResult[0]?.ANO || 0,          
            total: dbResult[0]?.TOTALVENTAS || 0 
        };
    }

    // Para los productos en inventario
    static toProductosInventarioResponse(dbResult) {
        return {
            total: dbResult[0]?.TOTALPRODUCTOS || 0
        };
    }

    // Para las ventas mensuales anteriores
    static toVentasMesAnteriorResponse(dbResult) {
        return {
            porcentaje: dbResult[0]?.PORCENTAJEVARIACION || 0
        };
    }

    static toOrdenesRecientesResponse(dbOrdenesRecientes) {
        return {
            numeroOrden: dbOrdenesRecientes.NUMEROORDEN,
            numeroProveedor: dbOrdenesRecientes.IDPROVEEDOR,
            fecha: dbOrdenesRecientes.FECHAMOVIMIENTO,
            cantidad: dbOrdenesRecientes.CANTIDAD,
            productos: dbOrdenesRecientes.PRODUCTOS,
            estado: dbOrdenesRecientes.ESTADO,
            total: dbOrdenesRecientes.TOTALORDEN
        };
    }

    static toOrdenesRecientesList(dbOrdenesRecientes) {
        if (!Array.isArray(dbOrdenesRecientes)) {
            return [];
        }
        return dbOrdenesRecientes.map(orden => this.toOrdenesRecientesResponse(orden));
    }

    static toVentasXCategoriaResponse(dbVentasXCategoria) {
        return {
            categoria: dbVentasXCategoria.CATEGORIA,
            total: dbVentasXCategoria.TOTALVENTAS,
            porcentaje: dbVentasXCategoria.PORCENTAJE
        };
    }

    static toVentasXCategoriaList(dbVentasXCategoria) {
        if (!Array.isArray(dbVentasXCategoria)) {
            return [];
        }
        return dbVentasXCategoria.map(categoria => this.toVentasXCategoriaResponse(categoria));
    }

    static toProductosMasVendidosMesActualResponse(dbProductosMasVendidos) {
        return {
            idProducto: dbProductosMasVendidos.ARTIID,
            nombre: dbProductosMasVendidos.ARTNOMBRE,
            precio: dbProductosMasVendidos.ARTPRECIOVENTA,
            existencia: dbProductosMasVendidos.ARTEXISTENCIA,
            estado: dbProductosMasVendidos.ESTADO,
            total: dbProductosMasVendidos.TOTALVENDIDOS
        };
    }

    static toProductosMasVendidosMesActualList(dbProductosMasVendidos) {
        if (!Array.isArray(dbProductosMasVendidos)) {
            return [];
        }
        return dbProductosMasVendidos.map(producto => this.toProductosMasVendidosMesActualResponse(producto));
    }
}

module.exports = InicioResponseDto;

