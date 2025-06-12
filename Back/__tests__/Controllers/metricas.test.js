const { executeQuery } = require('../../Utils/dbUtils');
const metricasController = require('../../Controllers/metricas');
const MetricasResponseDto = require('../../dto/Metricas/MetricasResponseDto');

// Mock de las dependencias
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

describe('Métricas Controller', () => {
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Configurar mock de request y response
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockReq = {
            params: {
                mes: '1',
                anio: '2024'
            }
        };
        mockRes = {
            status: mockStatus
        };
    });

    describe('getVentasPorCategoriaMes', () => {
        it('should return 400 if mes or anio is missing', async () => {
            mockReq.params = {};
            await metricasController.getVentasPorCategoriaMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Se requieren los parámetros mes y año'
                })
            );
        });

        it('should return 400 if mes is invalid', async () => {
            mockReq.params.mes = '13';
            await metricasController.getVentasPorCategoriaMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'El mes debe estar entre 1 y 12'
                })
            );
        });

        it('should return 404 if no data found', async () => {
            executeQuery.mockResolvedValue([]);
            await metricasController.getVentasPorCategoriaMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'No se encontraron ventas por categoría para el período especificado'
                })
            );
        });

        it('should return 200 with data for successful request', async () => {
            const mockData = [
                { CATEGNOMB: 'Categoría 1', PORCENTAJE: '30', TOTAL_VENTAS: '1000' },
                { CATEGNOMB: 'Categoría 2', PORCENTAJE: '70', TOTAL_VENTAS: '2000' }
            ];
            executeQuery.mockResolvedValue(mockData);
            await metricasController.getVentasPorCategoriaMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Ventas por categoría mensual obtenidas exitosamente'
                })
            );
        });
    });

    describe('getVentasPorCategoriaAnio', () => {
        it('should return 400 if anio is missing', async () => {
            mockReq.params = { mes: '1' };
            await metricasController.getVentasPorCategoriaAnio(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Se requiere el parámetro año'
                })
            );
        });

        it('should return 404 if no data found', async () => {
            executeQuery.mockResolvedValue([]);
            await metricasController.getVentasPorCategoriaAnio(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'No se encontraron ventas por categoría para el año especificado'
                })
            );
        });

        it('should return 200 with data for successful request', async () => {
            const mockData = [
                { CATEGNOMB: 'Categoría 1', PORCENTAJE: '30', TOTAL_VENTAS: '1000' },
                { CATEGNOMB: 'Categoría 2', PORCENTAJE: '70', TOTAL_VENTAS: '2000' }
            ];
            executeQuery.mockResolvedValue(mockData);
            await metricasController.getVentasPorCategoriaAnio(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Ventas por categoría anual obtenidas exitosamente'
                })
            );
        });
    });

    describe('getIndicadoresCompletosMes', () => {
        it('should return 400 if mes or anio is missing', async () => {
            mockReq.params = {};
            await metricasController.getIndicadoresCompletosMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Se requieren los parámetros mes y año'
                })
            );
        });

        it('should return 400 if mes is invalid', async () => {
            mockReq.params.mes = '13';
            await metricasController.getIndicadoresCompletosMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'El mes debe estar entre 1 y 12'
                })
            );
        });

        it('should return 404 if no data found', async () => {
            executeQuery.mockResolvedValue([]);
            await metricasController.getIndicadoresCompletosMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'No se encontraron indicadores para el período especificado'
                })
            );
        });

        it('should return 200 with data for successful request', async () => {
            const mockData = [{
                VENTAS_TOTALES: 1000,
                VAR_VENTAS_PORC: 5,
                MODELO_MAS_VENDIDO: 'Modelo A',
                GANANCIAS: 500,
                VAR_GANANCIAS_PORC: 10,
                MARGEN_PROMEDIO: 50,
                CLIENTES_NUEVOS: 100,
                VAR_CLIENTES_PORC: 15,
                VENTA_PROMEDIO: 200,
                VAR_VENTA_PROMEDIO: 8,
                PROD_PROM_VENTA: 2
            }];
            executeQuery.mockResolvedValue(mockData);
            await metricasController.getIndicadoresCompletosMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Indicadores completos mensual obtenidos exitosamente'
                })
            );
        });
    });

    describe('getIndicadoresCompletosAnio', () => {
        it('should return 400 if anio is missing', async () => {
            mockReq.params = { mes: '1' };
            await metricasController.getIndicadoresCompletosAnio(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Se requiere el parámetro año'
                })
            );
        });

        it('should return 404 if no data found', async () => {
            executeQuery.mockResolvedValue([]);
            await metricasController.getIndicadoresCompletosAnio(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'No se encontraron indicadores para el año especificado'
                })
            );
        });

        it('should return 200 with data for successful request', async () => {
            const mockData = [{
                VENTAS_TOTALES: 12000,
                VAR_VENTAS_PORC: 5,
                MODELO_MAS_VENDIDO: 'Modelo A',
                GANANCIAS: 6000,
                VAR_GANANCIAS_PORC: 10,
                MARGEN_PROMEDIO: 50,
                CLIENTES_NUEVOS: 1200,
                VAR_CLIENTES_PORC: 15,
                VENTA_PROMEDIO: 2400,
                VAR_VENTA_PROMEDIO: 8,
                PROD_PROM_VENTA: 2
            }];
            executeQuery.mockResolvedValue(mockData);
            await metricasController.getIndicadoresCompletosAnio(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Indicadores completos anual obtenidos exitosamente'
                })
            );
        });
    });

    describe('getStockPorCategoria', () => {
        it('should return 404 if no data found', async () => {
            executeQuery.mockResolvedValue([]);
            await metricasController.getStockPorCategoria(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'No se encontraron datos de stock por categoría'
                })
            );
        });

        it('should return 200 with data for successful request', async () => {
            const mockData = [
                { CATEGNOMB: 'Categoría 1', STOCK_TOTAL: 100 },
                { CATEGNOMB: 'Categoría 2', STOCK_TOTAL: 200 }
            ];
            executeQuery.mockResolvedValue(mockData);
            await metricasController.getStockPorCategoria(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Stock por categoría obtenido exitosamente'
                })
            );
        });
    });

    describe('Error handling', () => {
        it('should handle database errors', async () => {
            const mockError = new Error('Database error');
            executeQuery.mockRejectedValue(mockError);
            await metricasController.getVentasPorCategoriaMes(mockReq, mockRes);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Error en el servidor al obtener ventas por categoría mensual'
                })
            );
        });
    });
}); 