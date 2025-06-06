module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',        
    coverageReporters: ['text', 'lcov'], 
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
    verbose: true,
    setupFiles: ['<rootDir>/__tests__/setup.js']
  };
  