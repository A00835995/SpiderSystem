const express = require('express');
const router = express.Router();
const { 
    getAnalisisInventario
} = require('../Controllers/analisisInv');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT

// GET - Obtener análisis de inventario por período
router.get('/analisis/:anio', verifyToken, getAnalisisInventario);

module.exports = router;
