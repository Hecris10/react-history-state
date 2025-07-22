// Jest setup file for testing environment
import '@testing-library/jest-dom';

// Setup for testing
afterEach(() => {
  jest.clearAllMocks();
});

// Global test utilities
// Override console methods for testing if needed
// Uncomment specific methods below to mock them during tests
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };
