module.exports = {
    testEnvironment: 'node',
    collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: 'coverage',
  };
  