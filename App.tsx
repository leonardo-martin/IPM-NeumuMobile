import { toastConfig } from '@configs/toast'
import { ThemeProvider } from '@contexts/theme'
import { NavigationContainer } from '@react-navigation/native'
import { IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React, { FC, ReactElement } from 'react'
import { StatusBar } from 'react-native'
import codePush, { CodePushOptions } from "react-native-code-push"
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { Provider as ReduxProvider } from 'react-redux'
import Routes from 'routes'
import store from 'store'
import { FontAwesomeIconsPack } from './font-awesome-icon'
import { FontistoIconsPack } from './fontisto-icon'
import { IoniconsIconsPack } from './ionicons-icon'

const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: "Há uma nova versão disponível",
    mandatoryUpdateMessage: "Clique para atualizar"
  }
}

const App: FC = (): ReactElement => {

  return (
    <React.Fragment>
      <IconRegistry icons={[IoniconsIconsPack, EvaIconsPack, FontAwesomeIconsPack, FontistoIconsPack]} />
      <ThemeProvider>
        <SafeAreaProvider>
          <ReduxProvider store={store}>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
              <Routes />
            </NavigationContainer>
            <Toast
              config={toastConfig}
              position='top'
            />
          </ReduxProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default codePush(codePushOptions)(App)