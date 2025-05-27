const express = require('express');
const router = express.Router();
const { getComprasData, crearOrdenCompra } = require('../Controllers/compras');

// Ruta para obtener los datos de las compras
router.get('/getData', getComprasData);

// Ruta para crear una nueva orden de compra
router.post('/crearOrden', crearOrdenCompra);

module.exports = router;
