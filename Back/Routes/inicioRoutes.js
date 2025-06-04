const express = require('express');
const router = express.Router();
const { getOrdenesPendientes,getVentasMes,getProductosInventario,getVentasMesAnterior,getOrdenesRecientes,getVentasXCategoria,getProductosMasVendidosMesActual } = require('../Controllers/inicio');
const { verifyToken } = require('../Middleware/authMiddleware');

router.get('/ordenespendientes', verifyToken, getOrdenesPendientes);
router.get('/ventasmes', verifyToken, getVentasMes);
router.get('/productosinventario', verifyToken, getProductosInventario);
router.get('/ventasmesanterior', verifyToken, getVentasMesAnterior);
router.get('/ordenesrecientes', verifyToken, getOrdenesRecientes);
router.get('/ventasxcategoria', verifyToken, getVentasXCategoria);
router.get('/productosmasvendidosmesactual', verifyToken, getProductosMasVendidosMesActual);

module.exports = router;

