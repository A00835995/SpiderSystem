const express = require('express');
const router = express.Router();
const { getOrdenesProveedor, consultarOrdenCompra, actualizarOrdenAProceso } = require('../Controllers/ordenesProveedor');

// Ruta para obtener las órdenes del proveedor
router.get('/', getOrdenesProveedor);

// Ruta para consultar una orden de compra específica con su artículo
router.post('/consultar', consultarOrdenCompra);

// Ruta para actualizar el estado de una orden a "En Proceso"
router.post('/actualizar-a-proceso', actualizarOrdenAProceso);

module.exports = router;
