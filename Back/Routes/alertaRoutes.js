const express = require('express');
const router = express.Router();
const alertasController = require('../Controllers/alertas');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger ruta con JWT
router.get('/getAlertas', verifyToken, alertasController.getAlertas);

module.exports = router;
