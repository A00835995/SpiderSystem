const { executeQuery } = require('../../Utils/dbUtils');
const alertasController = require('../../Controllers/alertas');
const AlertasResponseDto = require('../../dto/Alertas/AlertasResponseDto');

// Mock de las dependencias
jest.mock('../../Utils/dbUtils', () => ({
  executeQuery: jest.fn()
}));

jest.mock('../../dto/Alertas/AlertasResponseDto', () => ({
  toAlertasList: jest.fn()
}));

describe('Alertas Controller', () => {
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
    mockReq = {};
    mockRes = {
      status: mockStatus
    };
  });

  describe('getAlertas', () => {
    it('should return 404 when no alerts are found', async () => {
      executeQuery.mockResolvedValue([]);

      await alertasController.getAlertas(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'No se encontraron alertas'
      });
    });

    it('should return 200 with alerts when found', async () => {
      const mockAlerts = [
        { id: 1, message: 'Test Alert 1' },
        { id: 2, message: 'Test Alert 2' }
      ];

      const mockFormattedAlerts = [
        { id: 1, message: 'Test Alert 1', formatted: true },
        { id: 2, message: 'Test Alert 2', formatted: true }
      ];

      executeQuery.mockResolvedValue(mockAlerts);
      AlertasResponseDto.toAlertasList.mockReturnValue(mockFormattedAlerts);

      await alertasController.getAlertas(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Alertas obtenidas exitosamente',
        data: mockFormattedAlerts
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      executeQuery.mockRejectedValue(mockError);

      await alertasController.getAlertas(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error en el servidor',
        error: mockError.message
      });
    });
  });
}); 