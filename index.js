/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'

AppRegistry.registerComponent('TeleNeuMu', () => gestureHandlerRootHOC(App))
