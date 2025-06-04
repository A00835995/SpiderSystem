const express = require('express');
const router = express.Router();
const { getChatMessages, sendMessage} = require('../Controllers/chat');
const { verifyToken } = require('../Middleware/authMiddleware');

// Proteger rutas con JWT
// Obtener mensajes entre dos usuarios
router.get('/:userId/:providerId', verifyToken, getChatMessages);

// Enviar un mensaje
router.post('/', verifyToken, sendMessage);

module.exports = router; 