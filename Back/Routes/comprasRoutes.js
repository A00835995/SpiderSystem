const express = require('express');
const router = express.Router();
const { getComprasData, crearOrdenCompra, getOrdenesEnProgreso, actualizarOrdenACompletada } = require('../Controllers/compras');

// Ruta para obtener los datos de las compras
router.get('/getData', getComprasData);

// Ruta para crear una nueva orden de compra
router.post('/crearOrden', crearOrdenCompra);

// Ruta para obtener las órdenes en progreso
router.get('/ordenesProgreso', getOrdenesEnProgreso);

// Ruta para actualizar el estado de una orden a "Completada" y actualizar inventario
router.post('/completarOrden', actualizarOrdenACompletada);

module.exports = router;
