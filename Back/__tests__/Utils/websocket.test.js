const WebSocket = require('ws');
const { initializeWebSocket, broadcastUpdate } = require('../../Utils/websocket');

// Mock de WebSocket
jest.mock('ws', () => {
    const mockWebSocket = {
        OPEN: 1,
        CLOSED: 3
    };

    const mockWebSocketServer = jest.fn().mockImplementation(() => ({
        on: jest.fn((event, callback) => {
            if (event === 'connection') {
                // Simular una conexión inmediatamente
                const mockWs = {
                    on: jest.fn(),
                    send: jest.fn(),
                    readyState: mockWebSocket.OPEN
                };
                callback(mockWs);
            }
        })
    }));

    return {
        Server: mockWebSocketServer,
        OPEN: mockWebSocket.OPEN,
        CLOSED: mockWebSocket.CLOSED
    };
});

describe('WebSocket Utils', () => {
    let mockServer;
    let mockWs;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Crear un mock del servidor
        mockServer = {
            on: jest.fn()
        };

        // Crear un mock del WebSocket
        mockWs = {
            on: jest.fn(),
            send: jest.fn(),
            readyState: WebSocket.OPEN
        };
    });

    describe('initializeWebSocket', () => {
        it('should initialize WebSocket server and set up connection handler', () => {
            initializeWebSocket(mockServer);

            // Verificar que se creó el servidor WebSocket
            expect(WebSocket.Server).toHaveBeenCalledWith({ server: mockServer });

            // Verificar que se configuró el manejador de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            expect(serverInstance.on).toHaveBeenCalledWith('connection', expect.any(Function));
        });

        it('should handle client connection and set up event handlers', () => {
            initializeWebSocket(mockServer);

            // Obtener el callback de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            const connectionCallback = serverInstance.on.mock.calls[0][1];

            // Simular una conexión
            connectionCallback(mockWs);

            // Verificar que se configuraron los manejadores de eventos
            expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
            expect(mockWs.on).toHaveBeenCalledWith('error', expect.any(Function));
        });

        it('should handle client disconnection', () => {
            initializeWebSocket(mockServer);

            // Obtener el callback de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            const connectionCallback = serverInstance.on.mock.calls[0][1];

            // Simular una conexión
            connectionCallback(mockWs);

            // Obtener el callback de cierre
            const closeCallback = mockWs.on.mock.calls.find(call => call[0] === 'close')[1];

            // Simular un cierre
            closeCallback();

            // Verificar que se llamó al callback de cierre
            expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
        });

        it('should handle client errors', () => {
            initializeWebSocket(mockServer);

            // Obtener el callback de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            const connectionCallback = serverInstance.on.mock.calls[0][1];

            // Simular una conexión
            connectionCallback(mockWs);

            // Obtener el callback de error
            const errorCallback = mockWs.on.mock.calls.find(call => call[0] === 'error')[1];

            // Simular un error
            const mockError = new Error('Test error');
            errorCallback(mockError);

            // Verificar que se llamó al callback de error
            expect(mockWs.on).toHaveBeenCalledWith('error', expect.any(Function));
        });
    });

    describe('broadcastUpdate', () => {
        it('should not send updates if WebSocket server is not initialized', () => {
            const testData = { message: 'test' };
            broadcastUpdate(testData);
            // No debería haber errores ni llamadas a send
        });

        it('should broadcast message to all connected clients', () => {
            // Inicializar el servidor WebSocket
            initializeWebSocket(mockServer);

            // Obtener el callback de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            const connectionCallback = serverInstance.on.mock.calls[0][1];

            // Simular dos conexiones
            const mockWs1 = { ...mockWs, send: jest.fn() };
            const mockWs2 = { ...mockWs, send: jest.fn() };
            connectionCallback(mockWs1);
            connectionCallback(mockWs2);

            // Intentar enviar un mensaje
            const testData = { message: 'test' };
            broadcastUpdate(testData);

            // Verificar que se envió el mensaje a ambos clientes
            expect(mockWs1.send).toHaveBeenCalledWith(JSON.stringify(testData));
            expect(mockWs2.send).toHaveBeenCalledWith(JSON.stringify(testData));
        });

        it('should handle errors when sending messages', () => {
            // Inicializar el servidor WebSocket
            initializeWebSocket(mockServer);

            // Obtener el callback de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            const connectionCallback = serverInstance.on.mock.calls[0][1];

            // Simular una conexión con error al enviar
            const mockWsWithError = {
                on: jest.fn(),
                send: jest.fn().mockImplementation(() => {
                    throw new Error('Send error');
                }),
                readyState: WebSocket.OPEN
            };
            connectionCallback(mockWsWithError);

            // Intentar enviar un mensaje
            const testData = { message: 'test' };
            broadcastUpdate(testData);

            // Verificar que se intentó enviar el mensaje
            expect(mockWsWithError.send).toHaveBeenCalledWith(JSON.stringify(testData));
        });

        it('should not send to closed clients', () => {
            // Inicializar el servidor WebSocket
            initializeWebSocket(mockServer);

            // Obtener el callback de conexión
            const serverInstance = WebSocket.Server.mock.results[0].value;
            const connectionCallback = serverInstance.on.mock.calls[0][1];

            // Simular una conexión con estado cerrado
            const mockWsClosed = {
                on: jest.fn(),
                send: jest.fn(),
                readyState: WebSocket.CLOSED
            };
            connectionCallback(mockWsClosed);

            // Intentar enviar un mensaje
            const testData = { message: 'test' };
            broadcastUpdate(testData);

            // Verificar que no se intentó enviar el mensaje
            expect(mockWsClosed.send).not.toHaveBeenCalled();
        });
    });
}); 