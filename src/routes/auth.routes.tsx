import React, { FC, ReactElement } from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import HeaderAuth from '@components/header/auth'

import SignIn from '@pages/signin'
import ChangePasswordChoice from '@pages/changePassword'
import ChangePasswordRequest from '@pages/changePassword/changePasswordSpecific'
import RegistrationConfirmation from '@pages/signup/confirmation'
import RNWebView from '@components/webView'
import SignUpScreen from '@pages/signup'
import ChangePasswordConfirm from '@pages/changePassword/confirmation'

const { Navigator, Screen, Group } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => {

  return (
    <Navigator
      initialRouteName="SignIn"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Group screenOptions={{
        headerMode: 'float',
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS
      }}>
        <Screen name="SignIn" component={SignIn} />
        <Screen name="RegistrationConfirmation" component={RegistrationConfirmation} />
        <Screen name="ChangePasswordConfirmation" component={ChangePasswordConfirm}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="WebViewScreen" component={RNWebView} options={{
          gestureDirection: "horizontal",
          gestureEnabled: true,
        }} />
      </Group>

      <Group screenOptions={{
        headerShown: true,
        header: () => <HeaderAuth />,
        gestureEnabled: false,
        transitionSpec: {
          open: { animation: 'timing', config: { duration: 500 } },
          close: { animation: 'timing', config: { duration: 500 } }
        },
        cardStyleInterpolator: ({ current: { progress } }) => {
          return {
            cardStyle: {
              opacity: progress
            }
          }
        }
      }}>
        <Screen name='SignUp' component={SignUpScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="ChangePasswordChoice" component={ChangePasswordChoice}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="ChangePasswordRequest" component={ChangePasswordRequest} />
      </Group>

    </Navigator>
  )
}

export default AuthRoutes
