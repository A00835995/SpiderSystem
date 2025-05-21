class ComprasDto{
    static toArticulosResponse(dbArticulos){
        if(!Array.isArray(dbArticulos)){
            return [];
        }

        return dbArticulos.map(articulo => ({
            id: articulo.ARTIID,
            nombre: articulo.ARTNOMBRE,
            descripcion: articulo.ARTDESC,
            precioCompra: articulo.ARTPRECIOCOMPRA
        }));
    }

    static toProveedoresResponse(dbProveedores) {
        if (!Array.isArray(dbProveedores)) {
            return [];
        }

        return dbProveedores.map(proveedor => ({
            id: proveedor.IDPROV,
            nombre: proveedor.NOMPROV.trim() // Using RTRIM from your SP
        }));
    }

    static toPagosResponse(dbPagos){
        if(!Array.isArray(dbPagos)){
            return [];
        }

        return dbPagos.map(pago => ({
            id: pago.IDPAGO,
            nombre: pago.PAGONOM
        }));
    }
}

module.exports = ComprasDto;