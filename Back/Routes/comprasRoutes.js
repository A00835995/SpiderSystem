const express = require('express');
const router = express.Router();
const {getComprasData} = require('../Controllers/compras');

//Ruta para obtener los datos de las compras
router.get('/getData', getComprasData);

module.exports = router;
