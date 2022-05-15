module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      safe: true,
      allowUndefined: true
    }],
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@configs": "./src/configs",
          "@constants": "./src/constants",
          "@contexts": "./src/contexts",
          "@helpers": "./src/helpers",
          "@hooks": "./src/hooks",
          "@models": "./src/models",
          "@pages": "./src/pages",
          "@routes": "./src/routes",
          "@services": "./src/services",
          "@store": "./src/store",
          "@types": "./src/types",
          "@utils": "./src/utils",
        }
      }
    ]
  ]
}
