// Map Angular TS path aliases used by Spartan Helm components for Jest

module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup.jest.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$'
    }
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/test/', // exclude Playwright example under src
    '<rootDir>/src/app/pages/chat/chat.spec.ts', // empty suite file
  ],
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '^@spartan-ng/helm/(.*)$': '<rootDir>/libs/ui/$1/src/index.ts',
    '^.+/supabase/superbase-client$': '<rootDir>/src/test/mocks/supabase-client.ts'
  },
};
