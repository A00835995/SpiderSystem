const { executeQuery } = require('../../Utils/dbUtils');
const { getArticulosParaVenta, registrarVenta } = require('../../Controllers/ventas');
const VentaResponseDto = require('../../dto/Ventas/VentaResponseDto');

// Mock de dbUtils
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

// Mock de VentaResponseDto
jest.mock('../../dto/Ventas/VentaResponseDto', () => ({
    toArticulosParaVentaList: jest.fn(data => data)
}));

describe('Ventas Controller', () => {
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;

    beforeEach(() => {
        // Limpiar todos los mocks
        jest.clearAllMocks();

        // Configurar mock de respuesta
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnThis();
        mockRes = {
            status: mockStatus,
            json: mockJson
        };

        // Configurar mock de request
        mockReq = {
            body: {},
            params: {},
            query: {}
        };
    });

    describe('getArticulosParaVenta', () => {
        it('should return 200 and articles when found', async () => {
            // Mock de datos de prueba
            const mockArticles = [
                { id: 1, nombre: 'Artículo 1', precio: 100 },
                { id: 2, nombre: 'Artículo 2', precio: 200 }
            ];

            // Configurar mocks
            executeQuery.mockResolvedValueOnce(mockArticles);
            VentaResponseDto.toArticulosParaVentaList.mockReturnValueOnce(mockArticles);

            // Ejecutar función
            await getArticulosParaVenta(mockReq, mockRes);

            // Verificar resultados
            expect(executeQuery).toHaveBeenCalledWith('CALL ObtenerArticulosVenta()');
            expect(VentaResponseDto.toArticulosParaVentaList).toHaveBeenCalledWith(mockArticles);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: "Artículos para venta obtenidos exitosamente",
                data: mockArticles
            });
        });

        it('should return 404 when no articles are found', async () => {
            // Configurar mock para retornar array vacío
            executeQuery.mockResolvedValueOnce([]);

            // Ejecutar función
            await getArticulosParaVenta(mockReq, mockRes);

            // Verificar resultados
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "No se encontraron artículos disponibles para venta"
            });
        });

        it('should handle database errors', async () => {
            // Configurar mock para lanzar error
            const mockError = new Error('Database error');
            executeQuery.mockRejectedValueOnce(mockError);

            // Ejecutar función
            await getArticulosParaVenta(mockReq, mockRes);

            // Verificar resultados
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Error al obtener artículos para venta",
                error: mockError.message
            });
        });
    });

    describe('registrarVenta', () => {
        const mockVentaData = {
            venta: {
                idCliente: 1,
                total: 100
            },
            detalles: [
                {
                    idArticulo: 1,
                    cantidad: 2,
                    precio: 50
                }
            ]
        };

        it('should return 201 when sale is registered successfully', async () => {
            // Configurar mocks
            const mockResult = [{ IdVenta: 1, Mensaje: 'Venta registrada exitosamente' }];
            executeQuery.mockResolvedValueOnce(mockResult);

            // Configurar request
            mockReq.body = mockVentaData;

            // Ejecutar función
            await registrarVenta(mockReq, mockRes);

            // Verificar resultados
            expect(executeQuery).toHaveBeenCalledWith(
                'CALL DBADMIN.PR_REGISTRAR_VENTA(?)',
                [JSON.stringify(mockVentaData)]
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: "Venta registrada exitosamente",
                data: {
                    IdVenta: 1,
                    Mensaje: 'Venta registrada exitosamente'
                }
            });
        });

        it('should return 400 when request body is invalid', async () => {
            // Configurar request con datos inválidos
            mockReq.body = {};

            // Ejecutar función
            await registrarVenta(mockReq, mockRes);

            // Verificar resultados
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Formato de datos inválido. Se requiere un objeto con 'venta' y 'detalles'."
            });
        });

        it('should handle database errors', async () => {
            // Configurar mocks
            const mockError = new Error('Database error');
            executeQuery.mockRejectedValueOnce(mockError);

            // Configurar request
            mockReq.body = mockVentaData;

            // Ejecutar función
            await registrarVenta(mockReq, mockRes);

            // Verificar resultados
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "Error en la base de datos al registrar la venta",
                error: mockError.message,
                code: mockError.code,
                sqlState: mockError.sqlState
            });
        });

        it('should handle empty result from stored procedure', async () => {
            // Configurar mocks para retornar resultado vacío
            executeQuery.mockResolvedValueOnce([]);

            // Configurar request
            mockReq.body = mockVentaData;

            // Ejecutar función
            await registrarVenta(mockReq, mockRes);

            // Verificar resultados
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                message: "No se pudo registrar la venta"
            });
        });
    });
}); 