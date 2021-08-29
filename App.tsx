import React, { FC, ReactElement } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { customTheme as theme } from './custom-theme'
import Routes from './src/routes'
import { AuthProvider } from './src/contexts/auth'

const App: FC = (): ReactElement => {

  return (
    <React.Fragment>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider  {...eva} theme={{ ...eva.light, ...theme }}>
        <NavigationContainer>
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </NavigationContainer>
      </ApplicationProvider>
    </React.Fragment>
  )
}

export default App