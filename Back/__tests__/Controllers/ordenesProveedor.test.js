const { executeQuery } = require('../../Utils/dbUtils');
const jwt = require('jsonwebtoken');
const {
    getOrdenesProveedor,
    consultarOrdenCompra,
    actualizarOrdenAProceso,
    actualizarOrdenACompletada
} = require('../../Controllers/ordenesProveedor');

// Mock de dbUtils
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

// Mock de jwt
jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

describe('OrdenesProveedor Controller', () => {
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
            headers: {
                authorization: 'Bearer mock-token'
            },
            body: {},
            params: {}
        };
    });

    describe('getOrdenesProveedor', () => {
        it('should return 200 and list of orders when orders exist for admin', async () => {
            const mockOrders = [
                {
                    IDORDEN: 1,
                    FECHAENTREGA: '2024-03-20',
                    FECMOVTO: '2024-03-19',
                    ORDSTATNOM: 'Pendiente',
                    NOMPROV: 'Proveedor 1'
                }
            ];

            executeQuery.mockResolvedValueOnce(mockOrders);

            await getOrdenesProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GETordenedesProveedor()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Órdenes de proveedor obtenidas correctamente',
                data: expect.any(Array)
            });
        });

        it('should return 200 and list of orders when orders exist for provider', async () => {
            const mockOrders = [
                {
                    IDORDEN: 1,
                    FECHAENTREGA: '2024-03-20',
                    FECMOVTO: '2024-03-19',
                    ORDSTATNOM: 'Pendiente',
                    NOMPROV: 'Proveedor 1'
                }
            ];

            jwt.verify.mockReturnValueOnce({ role: 4, proveedorId: 1 });
            executeQuery.mockResolvedValueOnce(mockOrders);

            await getOrdenesProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GETordenesProveedorPorId(?)', [1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Órdenes de proveedor obtenidas correctamente',
                data: expect.any(Array)
            });
        });

        it('should return 404 when no orders exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getOrdenesProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontraron órdenes de proveedor'
            });
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getOrdenesProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al obtener órdenes de proveedor',
                error: error.message
            });
        });
    });

    describe('consultarOrdenCompra', () => {
        it('should return 200 and order details when order exists', async () => {
            const mockOrder = {
                IdOrden: 1,
                IdProv: 1,
                NomProv: 'Proveedor 1',
                FechaEntrega: '2024-03-20',
                FecMovto: '2024-03-19',
                OrdStatNom: 'Pendiente',
                PagoNom: 'Crédito',
                ArtiId: 1,
                ArtNombre: 'Producto 1',
                OrdArtCant: 5,
                ArtprecioCompra: 100,
                Total: 500
            };

            mockReq.body = { IdOrden: 1 };
            executeQuery.mockResolvedValueOnce([mockOrder]);

            await consultarOrdenCompra(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL ConsultarOrdenCompra(?)', [expect.any(String)]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Detalle de orden de compra obtenido correctamente',
                data: expect.any(Object)
            });
        });

        it('should return 400 when IdOrden is missing', async () => {
            await consultarOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere el ID de la orden'
            });
        });

        it('should return 404 when order does not exist', async () => {
            mockReq.body = { IdOrden: 1 };
            executeQuery.mockResolvedValueOnce([]);

            await consultarOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'No se encontró la orden de compra especificada'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { IdOrden: 1 };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await consultarOrdenCompra(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al consultar la orden de compra',
                error: error.message,
                stack: error.stack
            });
        });
    });

    describe('actualizarOrdenAProceso', () => {
        it('should return 200 when order is updated successfully by admin', async () => {
            mockReq.body = { IdOrden: 1 };
            executeQuery.mockResolvedValueOnce({ affectedRows: 1 });

            await actualizarOrdenAProceso(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL ActualizarEstadoOrdenProceso(?)', [1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Estado de la orden actualizado correctamente a En Proceso',
                ordenId: 1
            });
        });

        it('should return 200 when order is updated successfully by provider', async () => {
            mockReq.body = { IdOrden: 1 };
            jwt.verify.mockReturnValueOnce({ role: 4, proveedorId: 1 });
            executeQuery.mockResolvedValueOnce({ affectedRows: 1 });

            await actualizarOrdenAProceso(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL ActualizarEstadoOrdenProcesoProveedor(?, ?)', [1, 1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Estado de la orden actualizado correctamente a En Proceso',
                ordenId: 1
            });
        });

        it('should return 400 when IdOrden is missing', async () => {
            await actualizarOrdenAProceso(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere el ID de la orden'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { IdOrden: 1 };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await actualizarOrdenAProceso(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al actualizar el estado de la orden',
                error: error.message,
                stack: error.stack
            });
        });
    });

    describe('actualizarOrdenACompletada', () => {
        it('should return 200 when order is completed successfully', async () => {
            mockReq.body = { IdOrden: 1 };
            executeQuery.mockResolvedValueOnce({ affectedRows: 1 });

            await actualizarOrdenACompletada(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL ActualizarEstadoOrdenCompletada(?)', [1]);
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