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

// GET - Obtener resumen financiero mensual
router.get('/resumen-financiero/mes/:mes/:anio', getResumenFinancieroMes);

// GET - Obtener resumen financiero anual
router.get('/resumen-financiero/anio/:anio', getResumenFinancieroAnio);

// GET - Obtener ventas por categoría mensual
router.get('/ventas-categoria/mes/:mes/:anio', getVentasPorCategoriaMes);

// GET - Obtener ventas por categoría anual
router.get('/ventas-categoria/anio/:anio', getVentasPorCategoriaAnio);

// GET - Obtener indicadores de cliente mensual
router.get('/indicadores-cliente/mes/:mes/:anio', getIndicadoresClienteVentaMes);

// GET - Obtener indicadores de cliente anual
router.get('/indicadores-cliente/anio/:anio', getIndicadoresClienteVentaAnio);

// GET - Obtener indicadores completos mensual (NUEVO SP)
router.get('/indicadores-completos/mes/:mes/:anio', getIndicadoresCompletosMes);

// GET - Obtener indicadores completos anual (NUEVO SP)
router.get('/indicadores-completos/anio/:anio', getIndicadoresCompletosAnio);

// GET - Obtener resumen de inventario completo (NUEVO SP)
router.get('/resumen-inventario-completo', getResumenInventarioCompleto);

// GET - Obtener stock por categoría (NUEVO SP)
router.get('/stock-por-categoria', getStockPorCategoria);

module.exports = router;
