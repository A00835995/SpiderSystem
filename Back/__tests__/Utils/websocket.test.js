const WebSocket = require('ws');
const { initializeWebSocket, broadcastUpdate } = require('../../Utils/websocket');

// Mock de WebSocket
jest.mock('ws', () => {
    const mockWebSocket = {
        on: jest.fn(),
        send: jest.fn(),
        close: jest.fn(),
        OPEN: 1,
        CLOSED: 3,
        readyState: 1
    };

    const mockServer = jest.fn().mockImplementation(() => ({
        on: jest.fn((event, callback) => {
            if (event === 'connection') {
                // Simular una conexión inmediatamente
                callback(mockWebSocket);
            }
        }),
        clients: new Set([mockWebSocket])
    }));

    const WebSocketMock = jest.fn().mockImplementation(() => mockWebSocket);
    WebSocketMock.Server = mockServer;
    WebSocketMock.OPEN = mockWebSocket.OPEN;
    WebSocketMock.CLOSED = mockWebSocket.CLOSED;

    return WebSocketMock;
});

describe('WebSocket Utils', () => {
    let mockServer;
    let mockWs;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();
        
        // Crear un nuevo mock de WebSocket para cada prueba
        mockWs = new WebSocket();
        mockServer = new WebSocket.Server();
        mockServer.clients = new Set([mockWs]);
    });

    describe('initializeWebSocket', () => {
        it('should initialize WebSocket server', () => {
            initializeWebSocket(mockServer);
            expect(mockServer.on).toHaveBeenCalledWith('connection', expect.any(Function));
        });

        it('should handle client connection', () => {
            initializeWebSocket(mockServer);
            expect(mockWs.on).toHaveBeenCalledWith('close', expect.any(Function));
            expect(mockWs.on).toHaveBeenCalledWith('error', expect.any(Function));
        });

        it('should handle client disconnection', () => {
            initializeWebSocket(mockServer);
            const closeHandler = mockWs.on.mock.calls.find(call => call[0] === 'close')[1];
            closeHandler();
            expect(mockServer.clients.size).toBe(0);
        });

        it('should handle client errors', () => {
            initializeWebSocket(mockServer);
            const errorHandler = mockWs.on.mock.calls.find(call => call[0] === 'error')[1];
            errorHandler(new Error('Test error'));
            expect(mockWs.close).toHaveBeenCalled();
        });
    });

    describe('broadcastUpdate', () => {
        it('should not send updates if server is not initialized', () => {
            broadcastUpdate({ type: 'test', data: 'test' });
            expect(mockWs.send).not.toHaveBeenCalled();
        });

        it('should broadcast message to all connected clients', () => {
            initializeWebSocket(mockServer);
            const message = { type: 'test', data: 'test' };
            broadcastUpdate(message);
            expect(mockWs.send).toHaveBeenCalledWith(JSON.stringify(message));
        });

        it('should handle errors when sending messages', () => {
            const mockWsWithError = new WebSocket();
            mockWsWithError.send.mockImplementationOnce(() => {
                throw new Error('Send error');
            });
            mockServer.clients.add(mockWsWithError);

            initializeWebSocket(mockServer);
            const message = { type: 'test', data: 'test' };
            broadcastUpdate(message);
            expect(mockWsWithError.close).toHaveBeenCalled();
        });

        it('should not send to closed clients', () => {
            const mockWsClosed = new WebSocket();
            mockWsClosed.readyState = WebSocket.CLOSED;
            mockServer.clients.add(mockWsClosed);

            initializeWebSocket(mockServer);
            const message = { type: 'test', data: 'test' };
            broadcastUpdate(message);
            expect(mockWsClosed.send).not.toHaveBeenCalled();
        });
    });
}); 