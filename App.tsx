import { toastConfig } from '@configs/toast'
import { ThemeProvider } from '@contexts/theme'
import { NavigationContainer } from '@react-navigation/native'
import { IconRegistry, Text } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import React, { FC, ReactElement } from 'react'
import { StatusBar } from 'react-native'
import codePush, { CodePushOptions } from "react-native-code-push"
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { Provider as ReduxProvider } from 'react-redux'
import Routes from 'routes'
import store from 'store'
import { linking } from './deep-linking'
import { FontAwesomeIconsPack } from './font-awesome-icon'
import { FontistoIconsPack } from './fontisto-icon'
import { IoniconsIconsPack } from './ionicons-icon'

const codePushOptions: CodePushOptions = {
  checkFrequency: __DEV__ ? codePush.CheckFrequency.MANUAL : codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: "Atualização",
    mandatoryUpdateMessage: "Atualização obrigatória. Clique em 'Instalar e Reiniciar' para atualizar e aguarde o aplicativo reiniciar",
    mandatoryContinueButtonLabel: "Instalar e Reiniciar",
    optionalUpdateMessage: "Uma nova versão está disponível. Clique em 'INSTALAR AGORA' para atualizar.",
    optionalIgnoreButtonLabel: 'Cancelar',
    optionalInstallButtonLabel: 'Instalar Agora'
  },
  rollbackRetryOptions: {
    maxRetryAttempts: 3,
  }
}

const App: FC = (): ReactElement => {

  return (
    <React.Fragment>
      <IconRegistry icons={[IoniconsIconsPack, EvaIconsPack, FontAwesomeIconsPack, FontistoIconsPack]} />
      <ThemeProvider>
        <SafeAreaProvider>
          <ReduxProvider store={store}>
            <NavigationContainer
              linking={linking}
              fallback={<Text category='label'>Carregando...</Text>}>
              <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent={true} />
              <Routes />
            </NavigationContainer>
            <Toast
              config={toastConfig}
              position='top'
              visibilityTime={5000}
            />
          </ReduxProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default codePush(codePushOptions)(App)