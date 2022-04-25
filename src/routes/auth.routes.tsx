import HeaderAuth from '@components/header/auth'
import RNWebView from '@components/webView'
import ChangePasswordChoice from '@pages/changePassword'
import ChangePasswordConfirm from '@pages/changePassword/confirmation'
import ChangePasswordWithToken from '@pages/changePassword/password-with-token'
import ChangePasswordRequest from '@pages/changePassword/selected-password-change-mode'
import SignIn from '@pages/signin'
import SignUpScreen from '@pages/signup'
import RegistrationConfirmation from '@pages/signup/confirmation'
import { createStackNavigator, StackCardInterpolationProps, TransitionPresets } from '@react-navigation/stack'
import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactElement } from 'react'


const { Navigator, Screen, Group } = createStackNavigator()

const AuthRoutes: FC = (): ReactElement => {

  const transitionSpec: {
    open: TransitionSpec
    close: TransitionSpec
  } = {
    open: { animation: 'timing', config: { duration: 500 } },
    close: { animation: 'timing', config: { duration: 500 } }
  }

  const cardStyleInterpolator = (props: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        opacity: props.current.progress
      }
    }
  }

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
        <Screen name="ChangePasswordWithToken" component={ChangePasswordWithToken}
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
        transitionSpec: transitionSpec,
        cardStyleInterpolator: cardStyleInterpolator
      }}>
        <Screen name="ChangePasswordChoice" component={ChangePasswordChoice}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
        <Screen name="ChangePasswordRequest" component={ChangePasswordRequest} />
      </Group>

      <Group screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        transitionSpec: transitionSpec,
        cardStyleInterpolator: cardStyleInterpolator
      }}>
        <Screen name='SignUp' component={SignUpScreen}
          options={{
            ...TransitionPresets.ModalSlideFromBottomIOS
          }} />
      </Group>

    </Navigator>
  )
}

export default AuthRoutes
