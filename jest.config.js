const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.spec.json',
    },
  },
  transform: {
    ...tsjPreset.transform,
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}