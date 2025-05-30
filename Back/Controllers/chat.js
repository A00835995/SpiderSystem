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
      
      // Emitir el mensaje a los usuarios involucrados
      io.to(`user_${receiverId}`).emit('newMessage', socketMessage);
      io.to(`user_${senderId}`).emit('newMessage', socketMessage);
      
      console.log(`Mensaje emitido por socket de ${senderId} a ${receiverId}`);
    }
    
    res.status(201).json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje', details: error.message });
  }
};

module.exports = { getChatMessages, sendMessage }; 