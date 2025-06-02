const express = require('express');
const router = express.Router();
const { getArticulosParaVenta, registrarVenta } = require('../Controllers/ventas');

// Ruta para obtener artículos disponibles para venta
router.get('/articulos-disponibles', getArticulosParaVenta);

// Ruta para registrar una nueva venta
router.post('/registrar', registrarVenta);

module.exports = router; 