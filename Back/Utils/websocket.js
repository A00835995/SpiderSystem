const WebSocket = require('ws');

let wss = null;
const clients = new Set();

const initializeWebSocket = (server) => {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        clients.add(ws);
        console.log('Cliente WebSocket conectado');

        ws.on('close', () => {
            clients.delete(ws);
            console.log('Cliente WebSocket desconectado');
        });

        ws.on('error', (error) => {
            console.error('Error en WebSocket:', error);
            clients.delete(ws);
        });
    });
};

const broadcastUpdate = (data) => {
    if (!wss) return;
    
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                client.send(JSON.stringify(data));
                console.log('Actualización enviada al cliente');
            } catch (error) {
                console.error('Error al enviar actualización:', error);
            }
        }
    });
};

module.exports = {
    initializeWebSocket,
    broadcastUpdate
}; 