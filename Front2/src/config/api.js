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
            completarOrden: "/compras/completarOrden",
            articulos: "/compras/articulos"
        },
        ventas: {
            articulosDisponibles: "/ventas/articulos-disponibles",
            registrar: "/ventas/registrar"
        },
        metricas: {
            ventasCategoria: {
                mes: "/metricas/ventas-categoria/mes/:mes/:anio",
                anio: "/metricas/ventas-categoria/anio/:anio"
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
        actualizarOrdenAProceso: "/ordenes-proveedor/actualizar-a-proceso",
        chat: "/chat",
        chatUsers: "/chat/users",
        tendenciaVentasAnual: "/predictivo/tendencia-ventas/anual/:anio",
        riesgoStockFuturo: "/predictivo/riesgo-stock/futuro/:periodo",
        analisisInventario: "/analisis-inventario/analisis/:periodo"
    },
    // Socket URL dinámico basado en baseUrl
    get socketURL() {
        return this.baseUrl.replace('/api', '');
    }
};

// Debug: Ver qué URL se está usando
console.log('🔧 API_CONFIG Debug:');
console.log('- NODE_ENV:', import.meta.env.MODE);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- baseUrl final:', API_CONFIG.baseUrl);
console.log('- URL de login será:', `${API_CONFIG.baseUrl}/login`);
console.log('- Entorno:', import.meta.env.MODE === 'production' ? 'PRODUCCIÓN' : 'DESARROLLO');