const express = require('express');
const router = express.Router();
const {
  obtenerRoles,
  obtenerPaginas,
  obtenerRolPagina,
  obtenerPaginasPermitidas,
  verificarPermiso
} = require('../Controllers/permisos');

// Rutas para el sistema de permisos
router.get('/roles', obtenerRoles);
router.get('/paginas', obtenerPaginas);
router.get('/rol-pagina', obtenerRolPagina);
router.get('/paginas-permitidas/:idRol', obtenerPaginasPermitidas);
router.get('/verificar-permiso/:idRol/:ruta', verificarPermiso);

module.exports = router; 