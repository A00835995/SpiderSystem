const express = require('express');
const router = express.Router();
const { getArticulos, getTotalArticulos, getTotalProductos } = require('../Controllers/articulos');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger rutas con JWT
// Ruta para obtener artículos
router.get('/getarticulos', verifyToken, getArticulos);
// Ruta para obtener el total 
router.get('/getTotalArticulos', verifyToken, getTotalArticulos);
// Ruta para contar los estados
router.get('/gettotalproductos', verifyToken, getTotalProductos);

module.exports = router;
