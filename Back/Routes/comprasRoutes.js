const express = require('express');
const router = express.Router();
const { getComprasData, getArticulosPorProveedor, crearOrdenCompra, getOrdenesEnProgreso, actualizarOrdenACompletada } = require('../Controllers/compras');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger rutas con JWT
// Ruta para obtener los datos de las compras
router.get('/getData', verifyToken, getComprasData);

// Ruta para obtener artículos por proveedor
router.get('/articulos/:providerId', verifyToken, getArticulosPorProveedor);

// Ruta para crear una nueva orden de compra
router.post('/crearOrden', verifyToken, crearOrdenCompra);

// Ruta para obtener las órdenes en progreso
router.get('/ordenesProgreso', verifyToken, getOrdenesEnProgreso);

// Ruta para actualizar el estado de una orden a "Completada" y actualizar inventario
router.post('/completarOrden', verifyToken, actualizarOrdenACompletada);

module.exports = router;
