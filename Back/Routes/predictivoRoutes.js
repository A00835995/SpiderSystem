const express = require('express');
const router = express.Router();
const { 
    getTendenciaVentasAnual,
    getRiesgoStockFuturo
} = require('../Controllers/predictivo');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT

// GET - Obtener tendencia de ventas anual
router.get('/tendencia-ventas/anual/:anio', verifyToken, getTendenciaVentasAnual);

// GET - Obtener riesgo de stock futuro por período
router.get('/riesgo-stock/futuro/:periodo', verifyToken, getRiesgoStockFuturo);

module.exports = router;
