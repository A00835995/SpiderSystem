const { executeQuery } = require('../../Utils/dbUtils');
const {
    getComprasData,
    getArticulosPorProveedor,
    crearOrdenCompra,
    getOrdenesEnProgreso,
    actualizarOrdenACompletada
} = require('../../Controllers/compras');

// Mock de dbUtils
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

describe('Compras Controller', () => {
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

    describe('getComprasData', () => {
        it('should return 200 and all data when no providerId is provided', async () => {
            const mockProveedores = [
                { IDPROV: 1, NOMPROV: 'Proveedor 1' },
                { IDPROV: 2, NOMPROV: 'Proveedor 2' }
            ];
            const mockPagos = [
                { IDPAGO: 1, PAGONOM: 'Crédito' },
                { IDPAGO: 2, PAGONOM: 'Contado' }
            ];

            executeQuery.mockResolvedValueOnce(mockProveedores);
            executeQuery.mockResolvedValueOnce(mockPagos);

            await getComprasData(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL MostrarProveedores()');
            expect(executeQuery).toHaveBeenCalledWith('CALL FormaPagoCompra()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Datos de compras obtenidos correctamente',
                data: expect.objectContaining({
                    articulos: expect.any(Array),
                    proveedores: expect.any(Array),
                    pagos: expect.any(Array)
                })
            });
        });

        it('should return 200 and filtered articles when providerId is provided', async () => {
            const mockProveedores = [
                { IDPROV: 1, NOMPROV: 'Proveedor 1' }
            ];
            const mockPagos = [
                { IDPAGO: 1, PAGONOM: 'Crédito' }
            ];
            const mockArticulos = [
                { ARTIID: 1, ARTNOMBRE: 'Artículo 1', ARTDESC: 'Descripción 1', ARTPRECIOCOMPRA: 100 }
            ];

            mockReq.query.providerId = '1';
            executeQuery.mockResolvedValueOnce(mockProveedores);
            executeQuery.mockResolvedValueOnce(mockPagos);
            executeQuery.mockResolvedValueOnce(mockArticulos);

            await getComprasData(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL MostrarArticulosCompras(?)', [1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Datos de compras obtenidos correctamente',
                data: expect.objectContaining({
                    articulos: expect.any(Array),
                    proveedores: expect.any(Array),
                    pagos: expect.any(Array)
                })
            });
        });

        it('should handle empty results from database', async () => {
            executeQuery.mockResolvedValueOnce([]);
            executeQuery.mockResolvedValueOnce([]);

            await getComprasData(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Datos de compras obtenidos correctamente',
                data: expect.objectContaining({
                    articulos: [],
                    proveedores: [],
                    pagos: []
                })
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getComprasData(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al obtener datos de compras',
                error: error.message
            });
        });
    });

    describe('getArticulosPorProveedor', () => {
        it('should return 200 and articles when provider exists', async () => {
            const mockArticulos = [
                { ARTIID: 1, ARTNOMBRE: 'Artículo 1', ARTDESC: 'Descripción 1', ARTPRECIOCOMPRA: 100 }
            ];

            mockReq.params.providerId = '1';
            executeQuery.mockResolvedValueOnce(mockArticulos);

            await getArticulosPorProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL MostrarArticulosCompras(?)', [1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Artículos obtenidos correctamente',
                data: expect.any(Array)
            });
        });

        it('should return 400 when providerId is invalid', async () => {
            mockReq.params.providerId = 'invalid';

            await getArticulosPorProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere un ID de proveedor válido'
            });
        });

        it('should return 400 when providerId is missing', async () => {
            await getArticulosPorProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere un ID de proveedor válido'
            });
        });

        it('should handle empty results from database', async () => {
            mockReq.params.providerId = '1';
            executeQuery.mockResolvedValueOnce([]);

            await getArticulosPorProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Artículos obtenidos correctamente',
                data: []
            });
        });

        it('should handle database errors', async () => {
            mockReq.params.providerId = '1';
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getArticulosPorProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al obtener artículos por proveedor',
                error: error.message
            });
        });
    });

    describe('crearOrdenCompra', () => {
        const validOrderData = {
            idProv: 1,
            idPago: 1,
            fechaPedido: '2024-03-20',
            fechaEntrega: '2024-03-25',
            items: [
                { ItemId: 1, ItemQuantity: 5, ItemPrice: 100 }
            ]
        };

        it('should return 201 when order is created successfully', async () => {
            const mockResult = {
                IDORDEN: 1,
                MENSAJE: 'Orden creada exitosamente'
            };

            mockReq.body = validOrderData;
            executeQuery.mockResolvedValueOnce([mockResult]);

            await crearOrdenCompra(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL DBADMIN.PR_CREAR_ORDEN_COMPRA(?)', [expect.any(String)]);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                ordenId: 1,
                mensaje: 'Orden creada exitosamente'
            });
        });

        it('should return 500 when order data is invalid', async () => {
            mockReq.body = { idProv: 1 }; // Datos incompletos

            await crearOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al crear la orden de compra',
                error: expect.any(String),
                stack: expect.any(String)
            });
        });

        it('should return 500 when items array is empty', async () => {
            mockReq.body = {
                ...validOrderData,
                items: []
            };

            await crearOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al crear la orden de compra',
                error: expect.any(String),
                stack: expect.any(String)
            });
        });

        it('should return 500 when item quantity is invalid', async () => {
            mockReq.body = {
                ...validOrderData,
                items: [{ ItemId: 1, ItemQuantity: 0, ItemPrice: 100 }]
            };

            await crearOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al crear la orden de compra',
                error: expect.any(String),
                stack: expect.any(String)
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = validOrderData;
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await crearOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al crear la orden de compra',
                error: error.message,
                stack: error.stack
            });
        });
    });

    describe('getOrdenesEnProgreso', () => {
        it('should return 200 and list of orders when orders exist', async () => {
            const mockOrders = [
                { IDORDEN: 1, NOMPROV: 'Proveedor 1', ORDSTATNOM: 'En Proceso' }
            ];

            executeQuery.mockResolvedValueOnce(mockOrders);

            await getOrdenesEnProgreso(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL OBTENERORDENESPROG()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Órdenes en progreso obtenidas correctamente',
                data: expect.any(Array)
            });
        });

        it('should return 404 when no orders exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getOrdenesEnProgreso(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron órdenes en progreso'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getOrdenesEnProgreso(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al obtener órdenes en progreso',
                error: error.message
            });
        });
    });

    describe('actualizarOrdenACompletada', () => {
        it('should return 200 when order is completed successfully', async () => {
            mockReq.body = { IdOrden: 1 };
            executeQuery.mockResolvedValueOnce({ affectedRows: 1 });

            await actualizarOrdenACompletada(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL DBADMIN.ActualizarEstadoOrdenCompletada(?)', [1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Estado de la orden actualizado correctamente a Completada',
                ordenId: 1
            });
        });

        it('should return 400 when IdOrden is missing', async () => {
            await actualizarOrdenACompletada(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere el ID de la orden'
            });
        });

        it('should return 400 when IdOrden is invalid', async () => {
            mockReq.body = { IdOrden: 'invalid' };

            await actualizarOrdenACompletada(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere el ID de la orden'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { IdOrden: 1 };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await actualizarOrdenACompletada(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al actualizar el estado de la orden',
                error: error.message,
                stack: error.stack
            });
        });
    });
}); 