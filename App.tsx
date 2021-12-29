import React, { FC, ReactElement } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Routes from '@routes/index'
import { AuthProvider } from '@contexts/auth'
import { ThemeProvider } from '@contexts/theme'
import { IoniconsIconsPack } from './ionicons-icon'
import { FontAwesomeIconsPack } from './font-awesome-icon'
import { FontistoIconsPack } from './fontisto-icon'

const App: FC = (): ReactElement => {

  return (
    <React.Fragment>
      <IconRegistry icons={[ IoniconsIconsPack, EvaIconsPack, FontAwesomeIconsPack, FontistoIconsPack ]} />
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