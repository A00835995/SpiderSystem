const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { connection } = require('../../Config/confDB');
const loginController = require('../../Controllers/login');

// Mock de las dependencias
jest.mock('../../Config/confDB', () => ({
  connection: {
    exec: jest.fn()
  }
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('Login Controller', () => {
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
      body: {
        email: 'test@example.com',
        password: 'password123'
      }
    };
    mockRes = {
      status: mockStatus
    };
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      mockReq.body = {};
      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Email y contraseña son requeridos'
      });
    });

    it('should return 404 if user is not found', async () => {
      connection.exec.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Usuario no encontrado'
      });
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = {
        IDUSR: 1,
        NAMEUSR: 'Test User',
        EMAILUSR: 'test@example.com',
        PASSUSR: 'hashedPassword',
        IDROL: 1
      };

      connection.exec.mockImplementation((query, params, callback) => {
        callback(null, [mockUser]);
      });

      bcrypt.compare.mockResolvedValue(false);

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Contraseña incorrecta'
      });
    });

    it('should return 200 and token for successful login with regular user', async () => {
      const mockUser = {
        IDUSR: 1,
        NAMEUSR: 'Test User',
        EMAILUSR: 'test@example.com',
        PASSUSR: 'hashedPassword',
        IDROL: 1
      };

      const mockToken = 'mock.jwt.token';

      connection.exec.mockImplementation((query, params, callback) => {
        callback(null, [mockUser]);
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Login exitoso',
        token: mockToken,
        user: {
          id: mockUser.IDUSR,
          name: mockUser.NAMEUSR,
          email: mockUser.EMAILUSR,
          role: mockUser.IDROL
        }
      });
    });

    it('should return 200 and token for successful login with provider user (with IDPROV)', async () => {
      const mockUser = {
        IDUSR: 1,
        NAMEUSR: 'Test Provider',
        EMAILUSR: 'provider@example.com',
        PASSUSR: 'hashedPassword',
        IDROL: 4,
        IDPROV: 123
      };

      const mockToken = 'mock.jwt.token';

      connection.exec.mockImplementation((query, params, callback) => {
        callback(null, [mockUser]);
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Login exitoso',
        token: mockToken,
        user: {
          id: mockUser.IDUSR,
          name: mockUser.NAMEUSR,
          email: mockUser.EMAILUSR,
          role: mockUser.IDROL,
          proveedorId: mockUser.IDPROV
        }
      });
    });

    it('should return 200 and token for successful login with provider user (without IDPROV)', async () => {
      const mockUser = {
        IDUSR: 1,
        NAMEUSR: 'Test Provider',
        EMAILUSR: 'provider@example.com',
        PASSUSR: 'hashedPassword',
        IDROL: 4
      };

      const mockToken = 'mock.jwt.token';

      connection.exec.mockImplementation((query, params, callback) => {
        callback(null, [mockUser]);
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(mockToken);

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Login exitoso',
        token: mockToken,
        user: {
          id: mockUser.IDUSR,
          name: mockUser.NAMEUSR,
          email: mockUser.EMAILUSR,
          role: mockUser.IDROL
        }
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      connection.exec.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error al buscar correo',
        error: mockError.message
      });
    });

    it('should handle unexpected errors', async () => {
      const mockError = new Error('Unexpected error');
      connection.exec.mockImplementation(() => {
        throw mockError;
      });

      await loginController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error en el servidor',
        error: mockError.message
      });
    });
  });
}); 