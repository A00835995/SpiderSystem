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
    actualizarEmailProveedor
} = require('../Controllers/gestionProveedores');

// GET - Obtener lista de proveedores con resumen
router.get('/proveedores-resumen', getProveedoresResumen);

// GET - Obtener detalles de un proveedor específico
router.get('/detalle-proveedor/:id', getDetalleProveedor);

// GET - Obtener tipos de proveedores disponibles
router.get('/tipos-proveedores', getTiposProveedores);

// GET - Obtener tipos de pagos disponibles
router.get('/tipos-pagos-proveedores', getTiposPagosProveedores);

// POST - Crear un nuevo proveedor
router.post('/crear-proveedor', createProveedor);

// PUT - Actualizar nombre del proveedor
router.put('/actualizar-nombre/:id', actualizarNombreProveedor);

// PUT - Actualizar nombre del contacto del proveedor
router.put('/actualizar-nombre-contacto/:id', actualizarNombreContactoProveedor);

// PUT - Actualizar email del proveedor
router.put('/actualizar-email/:id', actualizarEmailProveedor);

// PUT - Actualizar teléfono del proveedor
router.put('/actualizar-telefono/:id', actualizarTelefonoProveedor);

// PUT - Actualizar dirección del proveedor
router.put('/actualizar-direccion/:id', actualizarDireccionProveedor);

// PUT - Actualizar tipo de proveedor
router.put('/actualizar-tipo/:id', actualizarTipoProveedor);

// PUT - Actualizar tipo de pago del proveedor
router.put('/actualizar-tipo-pago/:id', actualizarTipoPagoProveedor);

// GET - Obtener resumen por categorías de productos
router.get('/resumen-categorias', getResumenCategorias);

// GET - Obtener distribución de proveedores por inventario
router.get('/distribucion-proveedor-inventario', getDistribucionProveedorInventario);

module.exports = router;


