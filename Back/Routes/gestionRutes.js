const express = require('express');
const router = express.Router();
const { getUsuarios, getUsuario, createUsuario, updateRolUsuario, updateNombreUsuario, updateEmailUsuario, deleteUsuario } = require('../Controllers/gestionUsuarios');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger todas las rutas con JWT
router.get('/usuarios', verifyToken, getUsuarios);
router.get('/usuario/:id', verifyToken, getUsuario);
router.post('/crear-usuario', verifyToken, createUsuario);
router.put('/actualizar-rol-usuario', verifyToken, updateRolUsuario);
router.put('/actualizar-nombre-usuario', verifyToken, updateNombreUsuario);
router.put('/actualizar-email-usuario', verifyToken, updateEmailUsuario);
router.delete('/eliminar-usuario', verifyToken, deleteUsuario);

module.exports = router;


