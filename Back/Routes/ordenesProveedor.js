const express = require('express');
const router = express.Router();
const { getOrdenesProveedor, consultarOrdenCompra, actualizarOrdenAProceso, actualizarOrdenACompletada } = require('../Controllers/ordenesProveedor');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT
// Ruta para obtener las órdenes del proveedor
router.get('/', verifyToken, getOrdenesProveedor);

// Ruta para consultar una orden de compra específica con su artículo
router.post('/consultar', verifyToken, consultarOrdenCompra);

// Ruta para actualizar el estado de una orden a "En Proceso"
router.post('/actualizar-a-proceso', verifyToken, actualizarOrdenAProceso);

// Ruta para actualizar el estado de una orden a "Completada" y actualizar inventario
router.post('/actualizar-a-completada', verifyToken, actualizarOrdenACompletada);

module.exports = router;
