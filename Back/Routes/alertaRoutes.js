const express = require('express');
const router = express.Router();
const alertasController = require('../Controllers/alertas');

router.get('/getAlertas', alertasController.getAlertas);

module.exports = router;
