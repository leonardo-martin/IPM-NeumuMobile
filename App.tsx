import React, { FC, ReactElement } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Routes from '@routes/index'
import { AuthProvider } from '@contexts/auth'
import { ThemeProvider } from '@contexts/theme'

const App: FC = (): ReactElement => {

  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeProvider>
        <NavigationContainer>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </NavigationContainer>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App