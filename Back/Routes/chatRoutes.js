const express = require('express');
const router = express.Router();
const { getChatMessages, sendMessage } = require('../Controllers/chat');

// Obtener mensajes entre dos usuarios
router.get('/:userId/:providerId', getChatMessages);

// Enviar un mensaje
router.post('/', sendMessage);

module.exports = router; 