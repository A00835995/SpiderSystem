// Configuración global para las pruebas
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

// Mock de console.error y console.log para evitar ruido en las pruebas
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
}; 