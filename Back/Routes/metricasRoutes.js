const express = require('express');
const router = express.Router();
const { 
    getResumenFinancieroMes,
    getResumenFinancieroAnio,
    getVentasPorCategoriaMes,
    getVentasPorCategoriaAnio,
    getIndicadoresClienteVentaMes,
    getIndicadoresClienteVentaAnio,
    getIndicadoresCompletosMes,
    getIndicadoresCompletosAnio,
    getResumenInventarioCompleto,
    getStockPorCategoria
} = require('../Controllers/metricas');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT
// GET - Obtener resumen financiero mensual
router.get('/resumen-financiero/mes/:mes/:anio', verifyToken, getResumenFinancieroMes);

// GET - Obtener resumen financiero anual
router.get('/resumen-financiero/anio/:anio', verifyToken, getResumenFinancieroAnio);

// GET - Obtener ventas por categoría mensual
router.get('/ventas-categoria/mes/:mes/:anio', verifyToken, getVentasPorCategoriaMes);

// GET - Obtener ventas por categoría anual
router.get('/ventas-categoria/anio/:anio', verifyToken, getVentasPorCategoriaAnio);

// GET - Obtener indicadores de cliente mensual
router.get('/indicadores-cliente/mes/:mes/:anio', verifyToken, getIndicadoresClienteVentaMes);

// GET - Obtener indicadores de cliente anual
router.get('/indicadores-cliente/anio/:anio', verifyToken, getIndicadoresClienteVentaAnio);

// GET - Obtener indicadores completos mensual (NUEVO SP)
router.get('/indicadores-completos/mes/:mes/:anio', verifyToken, getIndicadoresCompletosMes);

// GET - Obtener indicadores completos anual (NUEVO SP)
router.get('/indicadores-completos/anio/:anio', verifyToken, getIndicadoresCompletosAnio);

// GET - Obtener resumen de inventario completo (NUEVO SP)
router.get('/resumen-inventario-completo', verifyToken, getResumenInventarioCompleto);

// GET - Obtener stock por categoría (NUEVO SP)
router.get('/stock-por-categoria', verifyToken, getStockPorCategoria);

module.exports = router;
