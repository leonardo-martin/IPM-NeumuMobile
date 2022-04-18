import React, { FC, ReactElement } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import Routes from '@routes/index'
import { ThemeProvider } from '@contexts/theme'
import { IoniconsIconsPack } from './ionicons-icon'
import { FontAwesomeIconsPack } from './font-awesome-icon'
import { FontistoIconsPack } from './fontisto-icon'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'
import Toast from '@components/toast'
import { Provider as ReduxProvider } from 'react-redux'
import store from '@store/index'

const App: FC = (): ReactElement => {

  return (
    <React.Fragment>
      <IconRegistry icons={[IoniconsIconsPack, EvaIconsPack, FontAwesomeIconsPack, FontistoIconsPack]} />
      <ThemeProvider>
        <SafeAreaProvider>
          <ReduxProvider store={store}>
            <Toast />
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
              <Routes />
            </NavigationContainer>
          </ReduxProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App