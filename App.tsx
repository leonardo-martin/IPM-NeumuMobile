import React, { FC, ReactElement } from 'react'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { AuthProvider } from './src/contexts/auth'
import Routes from './src/routes'

const App: FC = (): ReactElement => {

  return (
    <PaperProvider>
      <NavigationContainer>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App
