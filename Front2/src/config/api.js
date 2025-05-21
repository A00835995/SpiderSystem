export const API_CONFIG = {
    baseUrl: "http://localhost:4000/api",
    endpoints: {
        articles: "/getarticulos",
        totalCount: "/getTotalArticulos",
        compras: {
            getData: "/compras/getData"
        },
        ordenesPendientes: "/ordenespendientes",
        ventasMes: "/ventasmes",
        productosInventario: "/productosinventario",
        ventasMesAnterior: "/ventasmesanterior",
        ordenesRecientes: "/ordenesrecientes",
        ventasXCategoria: "/ventasxcategoria",
        productosMasVendidosMesActual: "/productosmasvendidosmesactual"
    }
};