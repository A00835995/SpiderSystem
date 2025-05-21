export const API_CONFIG = {
    baseUrl: "http://localhost:4000/api",
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
        eliminarUsuario: "/gestion/eliminar-usuario"
    }
};