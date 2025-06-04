export const API_CONFIG = {
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    endpoints: {
        articles: "/getarticulos",
        totalCount: "/getTotalArticulos",
        ordenesPendientes: "/inicio/ordenespendientes",
        ventasMes: "/inicio/ventasmes",
        productosInventario: "/inicio/productosinventario",
        ventasMesAnterior: "/inicio/ventasmesanterior",
        ordenesRecientes: "/inicio/ordenesrecientes",
        ventasXCategoria: "/inicio/ventasxcategoria",
        productosMasVendidosMesActual: "/inicio/productosmasvendidosmesactual",
        usuarios: "/gestion/usuarios",
        usuario: "/gestion/usuario/:id",
        crearUsuario: "/gestion/crear-usuario",
        actualizarRolUsuario: "/gestion/actualizar-rol-usuario",
        actualizarNombreUsuario: "/gestion/actualizar-nombre-usuario",
        actualizarEmailUsuario: "/gestion/actualizar-email-usuario",
        eliminarUsuario: "/gestion/eliminar-usuario",
        getAlertas: "/alertas/getAlertas",
        getProveedoresResumen: "/gestion-proveedores/proveedores-resumen",
        getDetalleProveedor: "/gestion-proveedores/detalle-proveedor/:id",
        getTiposProveedores: "/gestion-proveedores/tipos-proveedores",
        getTiposPagosProveedores: "/gestion-proveedores/tipos-pagos-proveedores",
        crearProveedor: "/gestion-proveedores/crear-proveedor",
        actualizarNombreProveedor: "/gestion-proveedores/actualizar-nombre/:id",
        actualizarNombreContactoProveedor: "/gestion-proveedores/actualizar-nombre-contacto/:id",
        actualizarDireccionProveedor: "/gestion-proveedores/actualizar-direccion/:id",
        actualizarEmailProveedor: "/gestion-proveedores/actualizar-email/:id",
        actualizarTelefonoProveedor: "/gestion-proveedores/actualizar-telefono/:id",
        actualizarTipoProveedor: "/gestion-proveedores/actualizar-tipo/:id",
        actualizarTipoPagoProveedor: "/gestion-proveedores/actualizar-tipo-pago/:id",
        eliminarProveedor: "/gestion-proveedores/eliminar-proveedor/:id",
        getResumenCategorias: "/gestion-proveedores/resumen-categorias",
        getDistribucionProveedorInventario: "/gestion-proveedores/distribucion-proveedor-inventario",
        compras: {
            getData: "/compras/getdata",
            crearOrden: "/compras/crearOrden",
            ordenesProgreso: "/compras/ordenesProgreso",
            completarOrden: "/compras/completarOrden"
        },
        ventas: {
            articulosDisponibles: "/ventas/articulos-disponibles",
            registrar: "/ventas/registrar"
        },
        metricas: {
            resumenFinanciero: {
                mes: "/metricas/resumen-financiero/mes/:mes/:anio",
                anio: "/metricas/resumen-financiero/anio/:anio",
                categoria: "/metricas/ventas-categoria/mes/:mes/:anio",
                categoriaAnio: "/metricas/ventas-categoria/anio/:anio"
            },
            indicadoresCliente: {
                mes: "/metricas/indicadores-cliente/mes/:mes/:anio",
                anio: "/metricas/indicadores-cliente/anio/:anio"
            },
            indicadoresCompletos: {
                mes: "/metricas/indicadores-completos/mes/:mes/:anio",
                anio: "/metricas/indicadores-completos/anio/:anio"
            },
            inventario: {
                resumenCompleto: "/metricas/resumen-inventario-completo",
                stockPorCategoria: "/metricas/stock-por-categoria"
            }
        },
        ordenesProveedor: "/ordenes-proveedor",
        consultarOrdenCompra: "/ordenes-proveedor/consultar",
        actualizarOrdenAProceso: "/ordenes-proveedor/actualizar-a-proceso"
    }
};