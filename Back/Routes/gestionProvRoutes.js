const express = require('express');
const router = express.Router();
const { 
    getProveedoresResumen, 
    getDetalleProveedor, 
    createProveedor,
    actualizarNombreProveedor,
    actualizarNombreContactoProveedor,
    actualizarTelefonoProveedor,
    actualizarTipoProveedor,
    actualizarTipoPagoProveedor,
    getDistribucionProveedorInventario, 
    getResumenCategorias,
    getTiposProveedores,
    getTiposPagosProveedores,
    actualizarDireccionProveedor,
    actualizarEmailProveedor,
    eliminarProveedor
} = require('../Controllers/gestionProveedores');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT
// GET - Obtener lista de proveedores con resumen
router.get('/proveedores-resumen', verifyToken, getProveedoresResumen);

// GET - Obtener detalles de un proveedor específico
router.get('/detalle-proveedor/:id', verifyToken, getDetalleProveedor);

// GET - Obtener tipos de proveedores disponibles
router.get('/tipos-proveedores', verifyToken, getTiposProveedores);

// GET - Obtener tipos de pagos disponibles
router.get('/tipos-pagos-proveedores', verifyToken, getTiposPagosProveedores);

// POST - Crear un nuevo proveedor
router.post('/crear-proveedor', verifyToken, createProveedor);

// PUT - Actualizar nombre del proveedor
router.put('/actualizar-nombre/:id', verifyToken, actualizarNombreProveedor);

// PUT - Actualizar nombre del contacto del proveedor
router.put('/actualizar-nombre-contacto/:id', verifyToken, actualizarNombreContactoProveedor);

// PUT - Actualizar email del proveedor
router.put('/actualizar-email/:id', verifyToken, actualizarEmailProveedor);

// PUT - Actualizar teléfono del proveedor
router.put('/actualizar-telefono/:id', verifyToken, actualizarTelefonoProveedor);

// PUT - Actualizar dirección del proveedor
router.put('/actualizar-direccion/:id', verifyToken, actualizarDireccionProveedor);

// PUT - Actualizar tipo de proveedor
router.put('/actualizar-tipo/:id', verifyToken, actualizarTipoProveedor);

// PUT - Actualizar tipo de pago del proveedor
router.put('/actualizar-tipo-pago/:id', verifyToken, actualizarTipoPagoProveedor);

// DELETE - Eliminar proveedor (soft delete)
router.delete('/eliminar-proveedor/:id', verifyToken, eliminarProveedor);

// GET - Obtener resumen por categorías de productos
router.get('/resumen-categorias', verifyToken, getResumenCategorias);

// GET - Obtener distribución de proveedores por inventario
router.get('/distribucion-proveedor-inventario', verifyToken, getDistribucionProveedorInventario);

module.exports = router;


