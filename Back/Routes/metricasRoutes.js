const express = require('express');
const router = express.Router();
const { 
    getVentasPorCategoriaMes,
    getVentasPorCategoriaAnio,
    getIndicadoresCompletosMes,
    getIndicadoresCompletosAnio,
    getResumenInventarioCompleto,
    getStockPorCategoria
} = require('../Controllers/metricas');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT

// GET - Obtener ventas por categoría mensual
router.get('/ventas-categoria/mes/:mes/:anio', verifyToken, getVentasPorCategoriaMes);

// GET - Obtener ventas por categoría anual
router.get('/ventas-categoria/anio/:anio', verifyToken, getVentasPorCategoriaAnio);

// GET - Obtener indicadores completos mensual
router.get('/indicadores-completos/mes/:mes/:anio', verifyToken, getIndicadoresCompletosMes);

// GET - Obtener indicadores completos anual
router.get('/indicadores-completos/anio/:anio', verifyToken, getIndicadoresCompletosAnio);

// GET - Obtener resumen de inventario completo
router.get('/resumen-inventario-completo', verifyToken, getResumenInventarioCompleto);

// GET - Obtener stock por categoría
router.get('/stock-por-categoria', verifyToken, getStockPorCategoria);

module.exports = router;
