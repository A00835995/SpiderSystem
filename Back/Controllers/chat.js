const { executeQuery } = require('../Utils/dbUtils');
const MessageDto = require('../dto/Chat/messageDto');

// Obtener mensajes entre dos usuarios usando store procedure
const getChatMessages = async (req, res) => {
  const { userId, providerId } = req.params;
  try {
    const query = `CALL SP_GET_CHAT_MESSAGES(?, ?)`;
    const params = [userId, providerId];
    const result = await executeQuery(query, params);
    // SAP HANA puede devolver los resultados en result[0] dependiendo del driver
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
    const messages = rows.map(row => new MessageDto(row));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes', details: error.message });
  }
};

// Guardar un nuevo mensaje usando store procedure
const sendMessage = async (req, res) => {
  const { senderId, receiverId, imageUrl, messageText } = req.body;
  try {
    const query = `CALL SP_INSERT_MESSAGE(?, ?, ?, ?)`;
    const params = [senderId, receiverId, imageUrl || null, messageText];
    await executeQuery(query, params);
    
    // Obtener la instancia de socket.io del app context
    const io = req.app.get('io');
    if (io) {
      // Crear el mensaje para socket.io
      const socketMessage = {
        id: Date.now(), // ID temporal para el frontend
        senderId,
        receiverId,
        imageUrl,
        messageText,
        timestamp: new Date().toISOString()
      };
      
      // Verificar qué sockets están en cada sala
      const receiverRoom = `user_${receiverId}`;
      const senderRoom = `user_${senderId}`;
      
      const receiverSockets = io.sockets.adapter.rooms.get(receiverRoom);
      const senderSockets = io.sockets.adapter.rooms.get(senderRoom);
      
      console.log(`📤 Enviando mensaje de ${senderId} a ${receiverId}`);
      console.log(`👥 Receptor sala ${receiverRoom}: ${receiverSockets ? receiverSockets.size : 0} sockets`);
      console.log(`👥 Emisor sala ${senderRoom}: ${senderSockets ? senderSockets.size : 0} sockets`);
      
      // Emitir el mensaje a los usuarios involucrados
      io.to(receiverRoom).emit('newMessage', socketMessage);
      io.to(senderRoom).emit('newMessage', socketMessage);
      
      console.log(`✅ Mensaje emitido por socket de ${senderId} a ${receiverId}`);
    } else {
      console.log('❌ No se pudo obtener la instancia de socket.io');
    }
    
    res.status(201).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.log('❌ Error al enviar mensaje:', error.message);
    res.status(500).json({ error: 'Error al enviar el mensaje', details: error.message });
  }
};

module.exports = { getChatMessages, sendMessage }; 