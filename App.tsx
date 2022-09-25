import { toastConfig } from '@configs/toast'
import RealmContext from '@contexts/realm'
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
import OneSignal from 'react-native-onesignal';
import { NOTIFICATION } from 'constants/common'

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

OneSignal.setAppId(NOTIFICATION.ONESIGNAL_APP_ID);

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("notification: ", notification);
  const data = notification.additionalData
  console.log("additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});

const App: FC = (): ReactElement => {

  Realm.copyBundledRealmFiles()
  const { RealmProvider } = RealmContext

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
              <RealmProvider>
                <Routes />
              </RealmProvider>
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