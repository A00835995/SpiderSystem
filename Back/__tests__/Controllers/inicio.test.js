const { executeQuery } = require('../../Utils/dbUtils');
const {
    getOrdenesPendientes,
    getVentasMes,
    getProductosInventario,
    getVentasMesAnterior,
    getOrdenesRecientes,
    getVentasXCategoria,
    getProductosMasVendidosMesActual
} = require('../../Controllers/inicio');

// Mock de dbUtils
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

describe('Inicio Controller', () => {
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Configurar mock de response
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRes = {
            status: mockStatus,
            json: mockJson
        };

        // Configurar mock de request
        mockReq = {
            query: {},
            params: {},
            body: {}
        };
    });

    describe('getOrdenesPendientes', () => {
        it('should return 200 and total of pending orders', async () => {
            const mockResult = [{ CUENTAORDENESPEND: 5 }];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getOrdenesPendientes(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL ORDENESPENDIENTES()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Ordenes pendientes obtenidas exitosamente',
                data: { total: 5 }
            });
        });

        it('should return 404 when no pending orders exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getOrdenesPendientes(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron ordenes pendientes'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getOrdenesPendientes(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });

    describe('getVentasMes', () => {
        it('should return 200 and monthly sales data', async () => {
            const mockResult = [{
                MES: 3,
                ANO: 2024,
                TOTALVENTAS: 15000
            }];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getVentasMes(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL VENTASMES()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Ventas mensuales obtenidas exitosamente',
                data: {
                    mes: 3,
                    ano: 2024,
                    total: 15000
                }
            });
        });

        it('should return 404 when no monthly sales exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getVentasMes(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron ventas mensuales'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getVentasMes(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });

    describe('getProductosInventario', () => {
        it('should return 200 and total products in inventory', async () => {
            const mockResult = [{ TOTALPRODUCTOS: 100 }];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getProductosInventario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL PRODUCTOSINVENTARIO()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Productos en inventario obtenidos exitosamente',
                data: { total: 100 }
            });
        });

        it('should return 404 when no products exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getProductosInventario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron productos en inventario'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getProductosInventario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });

    describe('getVentasMesAnterior', () => {
        it('should return 200 and previous month sales variation', async () => {
            const mockResult = [{ PORCENTAJE_VARIACION: 15.5 }];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getVentasMesAnterior(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL PORCENTAJEVENTASMESANTERIOR()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Ventas mensuales anteriores obtenidas exitosamente',
                data: { porcentaje: 15.5 }
            });
        });

        it('should return 404 when no previous month sales exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getVentasMesAnterior(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron ventas mensuales anteriores'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getVentasMesAnterior(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });

    describe('getOrdenesRecientes', () => {
        it('should return 200 and recent orders', async () => {
            const mockResult = [
                { IDORDEN: 1, NOMPROV: 'Proveedor 1', ORDSTATNOM: 'En Proceso' },
                { IDORDEN: 2, NOMPROV: 'Proveedor 2', ORDSTATNOM: 'Completada' }
            ];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getOrdenesRecientes(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "Ultimas4OrdenesResumen"()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Ultimas 4 ordenes resumen obtenidas exitosamente',
                data: expect.any(Array)
            });
        });

        it('should return 404 when no recent orders exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getOrdenesRecientes(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron ultimas 4 ordenes resumen'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getOrdenesRecientes(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });

    describe('getVentasXCategoria', () => {
        it('should return 200 and sales by category', async () => {
            const mockResult = [
                { CATEGORIA: 'Electrónicos', TOTAL_VENTAS: 5000, PORCENTAJE: 40 },
                { CATEGORIA: 'Ropa', TOTAL_VENTAS: 3000, PORCENTAJE: 30 }
            ];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getVentasXCategoria(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "VENTASPORCATEGORIA"()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Ventas por categoria obtenidas exitosamente',
                data: expect.any(Array)
            });
        });

        it('should return 404 when no category sales exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getVentasXCategoria(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron ventas por categoria'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getVentasXCategoria(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });

    describe('getProductosMasVendidosMesActual', () => {
        it('should return 200 and top selling products', async () => {
            const mockResult = [
                {
                    ARTIID: 1,
                    ARTNOMBRE: 'Producto 1',
                    ARTPRECIOVENTA: 100,
                    ARTEXISTENCIA: 50,
                    ESTADO: 'Activo',
                    TOTALVENDIDOS: 100
                }
            ];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getProductosMasVendidosMesActual(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL TOP3_PRODUCTOS_MES_ACTUAL()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Productos mas vendidos del mes actual obtenidos exitosamente',
                data: expect.any(Array)
            });
        });

        it('should return 404 when no top selling products exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getProductosMasVendidosMesActual(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron productos mas vendidos del mes actual'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getProductosMasVendidosMesActual(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error en el servidor',
                error: error.message
            });
        });
    });
}); 