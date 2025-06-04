const express = require('express');
const router = express.Router();
const { getArticulosParaVenta, registrarVenta } = require('../Controllers/ventas');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT
// Ruta para obtener artículos disponibles para venta
router.get('/articulos-disponibles', verifyToken, getArticulosParaVenta);

// Ruta para registrar una nueva venta
router.post('/registrar', verifyToken, registrarVenta);

module.exports = router; 