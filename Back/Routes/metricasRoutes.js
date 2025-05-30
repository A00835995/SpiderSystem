const express = require('express');
const router = express.Router();
const { 
    getResumenFinancieroMes,
    getResumenFinancieroAnio,
    getVentasPorCategoriaMes,
    getVentasPorCategoriaAnio
} = require('../Controllers/metricas');

// GET - Obtener resumen financiero mensual
router.get('/resumen-financiero/mes/:mes/:anio', getResumenFinancieroMes);

// GET - Obtener resumen financiero anual
router.get('/resumen-financiero/anio/:anio', getResumenFinancieroAnio);

// GET - Obtener ventas por categoría mensual
router.get('/ventas-categoria/mes/:mes/:anio', getVentasPorCategoriaMes);

// GET - Obtener ventas por categoría anual
router.get('/ventas-categoria/anio/:anio', getVentasPorCategoriaAnio);

module.exports = router;
