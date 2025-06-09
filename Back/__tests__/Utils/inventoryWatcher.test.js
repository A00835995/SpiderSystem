const { executeQuery } = require('../../Utils/dbUtils');
const { broadcastUpdate } = require('../../Utils/websocket');
const { startInventoryWatcher } = require('../../Utils/inventoryWatcher');

// Mock de las dependencias
jest.mock('../../Utils/dbUtils');
jest.mock('../../Utils/websocket');

describe('Inventory Watcher', () => {
    // Limpiar todos los mocks antes de cada prueba
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    // Restaurar los timers reales después de cada prueba
    afterEach(() => {
        jest.useRealTimers();
    });

    describe('getInventoryState', () => {
        it('debería obtener el estado del inventario correctamente', async () => {
            // Mock de datos de prueba
            const mockArticulos = [
                { id: 1, nombre: 'Producto 1', cantidad: 10 },
                { id: 2, nombre: 'Producto 2', cantidad: 5 }
            ];
            const mockEstados = {
                disponibles: 10,
                bajoStock: 5,
                agotados: 2
            };

            // Configurar los mocks
            executeQuery.mockImplementation((query) => {
                if (query.includes('ArticulosDTO')) {
                    return Promise.resolve(mockArticulos);
                }
                if (query.includes('CONTARESTADOS')) {
                    return Promise.resolve(mockEstados);
                }
                return Promise.resolve([]);
            });

            // Obtener el estado del inventario
            const result = await require('../../Utils/inventoryWatcher').getInventoryState();

            // Verificar resultados
            expect(result).toEqual({
                articulos: mockArticulos,
                estados: mockEstados
            });
            expect(executeQuery).toHaveBeenCalledTimes(2);
        });

        it('debería manejar errores al obtener el estado del inventario', async () => {
            // Mock de error
            executeQuery.mockRejectedValue(new Error('Error de base de datos'));

            // Obtener el estado del inventario
            const result = await require('../../Utils/inventoryWatcher').getInventoryState();

            // Verificar resultados
            expect(result).toBeNull();
            expect(executeQuery).toHaveBeenCalledTimes(2);
        });
    });

    describe('checkInventoryChanges', () => {
        it('debería detectar cambios en el inventario y enviar actualización', async () => {
            // Mock de datos iniciales
            const mockArticulosIniciales = [
                { id: 1, nombre: 'Producto 1', cantidad: 10 }
            ];
            const mockEstadosIniciales = {
                disponibles: 10,
                bajoStock: 0,
                agotados: 0
            };

            // Mock de datos actualizados
            const mockArticulosActualizados = [
                { id: 1, nombre: 'Producto 1', cantidad: 5 }
            ];
            const mockEstadosActualizados = {
                disponibles: 5,
                bajoStock: 1,
                agotados: 0
            };

            // Configurar los mocks
            executeQuery.mockImplementation((query) => {
                if (query.includes('ArticulosDTO')) {
                    return Promise.resolve(mockArticulosActualizados);
                }
                if (query.includes('CONTARESTADOS')) {
                    return Promise.resolve(mockEstadosActualizados);
                }
                return Promise.resolve([]);
            });

            // Establecer estado inicial
            const inventoryWatcher = require('../../Utils/inventoryWatcher');
            inventoryWatcher.lastInventoryState = {
                articulos: mockArticulosIniciales,
                estados: mockEstadosIniciales
            };

            // Verificar cambios
            await inventoryWatcher.checkInventoryChanges();

            // Verificar que se envió la actualización
            expect(broadcastUpdate).toHaveBeenCalledWith({
                type: 'INVENTORY_UPDATE',
                data: mockArticulosActualizados,
                stats: mockEstadosActualizados
            });
        });

        it('no debería enviar actualización si no hay cambios', async () => {
            // Mock de datos
            const mockArticulos = [
                { id: 1, nombre: 'Producto 1', cantidad: 10 }
            ];
            const mockEstados = {
                disponibles: 10,
                bajoStock: 0,
                agotados: 0
            };

            // Configurar los mocks
            executeQuery.mockImplementation((query) => {
                if (query.includes('ArticulosDTO')) {
                    return Promise.resolve(mockArticulos);
                }
                if (query.includes('CONTARESTADOS')) {
                    return Promise.resolve(mockEstados);
                }
                return Promise.resolve([]);
            });

            // Establecer estado inicial
            const inventoryWatcher = require('../../Utils/inventoryWatcher');
            inventoryWatcher.lastInventoryState = {
                articulos: mockArticulos,
                estados: mockEstados
            };

            // Verificar cambios
            await inventoryWatcher.checkInventoryChanges();

            // Verificar que no se envió actualización
            expect(broadcastUpdate).not.toHaveBeenCalled();
        });
    });

    describe('startInventoryWatcher', () => {
        it('debería iniciar el monitor de inventario correctamente', () => {
            // Iniciar el watcher
            const watcherId = startInventoryWatcher(1000);

            // Verificar que se configuró el intervalo
            expect(watcherId).toBeDefined();
            expect(setInterval).toHaveBeenCalled();

            // Limpiar el intervalo
            clearInterval(watcherId);
        });

        it('debería realizar la primera verificación inmediatamente', () => {
            // Mock de la función checkInventoryChanges
            const mockCheckInventoryChanges = jest.fn();
            jest.spyOn(require('../../Utils/inventoryWatcher'), 'checkInventoryChanges')
                .mockImplementation(mockCheckInventoryChanges);

            // Iniciar el watcher
            const watcherId = startInventoryWatcher(1000);

            // Verificar que se realizó la primera verificación
            expect(mockCheckInventoryChanges).toHaveBeenCalled();

            // Limpiar el intervalo
            clearInterval(watcherId);
        });
    });
}); 