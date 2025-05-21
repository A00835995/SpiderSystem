const express = require('express');
const router = express.Router();
const { getOrdenesPendientes,getVentasMes,getProductosInventario,getVentasMesAnterior,getOrdenesRecientes,getVentasXCategoria,getProductosMasVendidosMesActual } = require('../Controllers/inicio');

router.get('/ordenespendientes', getOrdenesPendientes);
router.get('/ventasmes', getVentasMes);
router.get('/productosinventario', getProductosInventario);
router.get('/ventasmesanterior', getVentasMesAnterior);
router.get('/ordenesrecientes', getOrdenesRecientes);
router.get('/ventasxcategoria', getVentasXCategoria);
router.get('/productosmasvendidosmesactual', getProductosMasVendidosMesActual);

module.exports = router;

