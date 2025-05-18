class ArticuloResponseDto {
    static toResponse(dbArticulo){
        return{
            id: dbArticulo.ARTIID,
            nombre: dbArticulo.ARTNOMBRE,
            codigo: dbArticulo.ARTCODIGO,
            existencia: dbArticulo.ARTEXISTENCIA,
            ubicacion: dbArticulo.ARTUBI,
            proveedor: dbArticulo.NOMPROV,
            categoria: dbArticulo.CATEGNOMB,
            estado: dbArticulo.STATNOMB
        };
    }

    static toResponseList(dbArticulos){
        if (!Array.isArray(dbArticulos)) {
            return [];
        }
        return dbArticulos.map(articulo => this.toResponse(articulo));
    }

    //Funcion para contar los articulos
    static toTotalResponse(dbResult) {
        return {
            total: dbResult[0]?.NUMBEROFPRODUCTS || 0
        };
    }

    //Funcion para contar los estados
    static toEstadosResponse(dbResult){
        //Crear un objeto para almacenar los estados y sus totales
        const estados = {};

        //Checo si el resultado es un array 
        if(Array.isArray(dbResult)){
            dbResult.forEach(row => {
                const estadoNombre = row.ESTADO || 'Desconocido';
                const total = row.TOTAL || 0;
                estados[estadoNombre] = total;
            });
        }
        return estados;
    }

}

module.exports = ArticuloResponseDto;
