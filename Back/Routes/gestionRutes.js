const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuario, createUsuario, updateRolUsuario, updateNombreUsuario, updateEmailUsuario, deleteUsuario } = require('../Controllers/gestionUsuarios');

router.get('/usuarios', getUsuarios);
router.get('/usuario/:id', getUsuario);
router.post('/crear-usuario', createUsuario);
router.put('/actualizar-rol-usuario', updateRolUsuario);
router.put('/actualizar-nombre-usuario', updateNombreUsuario);
router.put('/actualizar-email-usuario', updateEmailUsuario);
router.delete('/eliminar-usuario', deleteUsuario);

module.exports = router;


